import { faker } from '@faker-js/faker';
import fs from 'node:fs';
import { promises as fsPromises } from 'node:fs';
import { join } from 'node:path';
import { createGzip } from 'node:zlib';


const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_1_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1.2 Mobile/15E148 Safari/604.1',
  'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
  'PostmanRuntime/7.36.0'
];

const REQUEST_PATHS = [
  '/api/v1/users',
  '/api/v1/products',
  '/api/v1/orders',
  '/api/v1/payments',
  '/api/v1/notifications',
  '/api/v1/analytics'
];

const SERVICES = [
  'api',
  'web',
  'auth',
  'payment',
  'notification',
  'analytics'
];

// Status code groups
const SUCCESS_CODES = [200, 201, 204];
const CLIENT_ERROR_CODES = [400, 401, 403, 404, 418, 429];
const SERVER_ERROR_CODES = [500, 502, 503];

function getTrafficMultiplier(date: Date): number {
  const hour = date.getHours();
  const dayOfWeek = date.getDay();
  
  // Weekend traffic is lower
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return 0.5;
  }

  // Business hours (9-17) have higher traffic
  if (hour >= 9 && hour <= 17) {
    return 2.0;
  }

  // Late night hours have very low traffic
  if (hour >= 1 && hour <= 5) {
    return 0.2;
  }

  // Normal traffic for other hours
  return 1.0;
}

function getErrorProbability(date: Date): number {
  const hour = date.getHours();
  
  // Higher error rates during deployment windows
  if (hour === 10 || hour === 15) {
    return 0.1; // 10% error rate during deployments
  }

  // Very low error rate during quiet hours
  if (hour >= 1 && hour <= 5) {
    return 0.01; // 1% error rate
  }

  // Normal error rate
  return 0.05; // 5% error rate
}

function generateLog(timestamp: Date) {
  const errorProb = getErrorProbability(timestamp);
  const isError = Math.random() < errorProb;
  
  let statusCode: number;
  let level: string;
  
  if (isError) {
    // Determine if it's a client or server error
    if (Math.random() < 0.8) { // 80% client errors
      statusCode = faker.helpers.arrayElement(CLIENT_ERROR_CODES);
      level = Math.random() < 0.8 ? 'WARN' : 'ERROR';
    } else { // 20% server errors
      statusCode = faker.helpers.arrayElement(SERVER_ERROR_CODES);
      level = 'ERROR';
    }
  } else {
    statusCode = faker.helpers.arrayElement(SUCCESS_CODES);
    level = 'INFO';
  }

  const service = faker.helpers.arrayElement(SERVICES);
  const requestPath = faker.helpers.arrayElement(REQUEST_PATHS);
  
  // Generate appropriate message based on status code
  let message: string;
  if (statusCode === 200) {
    message = `Successfully processed ${faker.helpers.arrayElement(['GET', 'POST', 'PUT', 'DELETE'])} request to ${requestPath}`;
  } else if (statusCode === 401) {
    message = 'Unauthorized access attempt - invalid credentials';
  } else if (statusCode === 404) {
    message = `Resource not found at ${requestPath}`;
  } else if (statusCode >= 500) {
    message = `Internal server error: ${faker.helpers.arrayElement([
      'Database connection failed',
      'Timeout exceeded',
      'Memory limit exceeded',
      'Unexpected exception occurred'
    ])}`;
  } else {
    message = faker.lorem.sentence(faker.number.int({ min: 4, max: 8 }));
  }

  return {
    timestamp: timestamp.toISOString(),
    level,
    message,
    service,
    request_id: faker.string.uuid(),
    environment: faker.helpers.weightedArrayElement([
      { weight: 60, value: 'production' },
      { weight: 30, value: 'staging' },
      { weight: 10, value: 'development' }
    ]),
    status_code: statusCode,
    response_time: faker.number.int({ min: 50, max: statusCode >= 500 ? 2000 : 1000 }),
    request_method: faker.helpers.weightedArrayElement([
      { weight: 60, value: 'GET' },
      { weight: 30, value: 'POST' },
      { weight: 8, value: 'PUT' },
      { weight: 2, value: 'DELETE' }
    ]),
    user_agent: faker.helpers.arrayElement(USER_AGENTS),
    request_path: requestPath,
    host: faker.helpers.weightedArrayElement([
      { weight: 60, value: 'api.example.com' },
      { weight: 30, value: 'staging.example.com' },
      { weight: 10, value: 'development.example.com' }
    ])
  };
}

async function generateLogs(startDate: Date, endDate: Date, logsPerSecondBase: number) {
  const MAX_FILE_SIZE = 9 * 1024 * 1024 * 1024;
  let currentFileSize = 0;
  let fileIndex = 1;
  let gzip = createGzip();
  let writeStream = fs.createWriteStream(`logs-${fileIndex}.ndjson.gz`);
  gzip.pipe(writeStream);

  const createNewStream = () => {
    fileIndex++;
    gzip = createGzip();
    writeStream = fs.createWriteStream(`logs-${fileIndex}.ndjson.gz`);
    gzip.pipe(writeStream);
    currentFileSize = 0;
  };

  // Handle backpressure
  const writeLogs = async (logs: string) => {
    currentFileSize += Buffer.byteLength(logs, 'utf8');
    
    if (currentFileSize >= MAX_FILE_SIZE) {
      await new Promise<void>((resolve) => gzip.end(() => resolve()));
      createNewStream();
    }

    if (!gzip.write(logs)) {
      await new Promise<void>((resolve) => {
        gzip.once('drain', () => resolve());
      });
    }
  };

  let currentDate = new Date(startDate);
  let totalLogs = 0;
  let lastLogCount = 0;
  const startTime = Date.now();
  
  // Calculate total days for progress
  const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  let lastProgressUpdate = Date.now();

  while (currentDate <= endDate) {
    const trafficMultiplier = getTrafficMultiplier(currentDate);
    const logsThisSecond = Math.floor(logsPerSecondBase * trafficMultiplier);
    
    let batchLogs = '';
    for (let i = 0; i < logsThisSecond; i++) {
      const log = generateLog(currentDate);
      batchLogs += JSON.stringify(log) + '\n';
      totalLogs++;
    }
    
    // Write batch of logs
    await writeLogs(batchLogs);
    
    // Update progress every 5 seconds
    if (Date.now() - lastProgressUpdate >= 5000) {
      const daysProcessed = Math.ceil((currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      const percentComplete = ((daysProcessed / totalDays) * 100).toFixed(2);
      const logsPerSecond = Math.floor((totalLogs - lastLogCount) / 5);
      const elapsedMinutes = (Date.now() - startTime) / 1000 / 60;
      const estimatedTotalMinutes = (elapsedMinutes / (daysProcessed / totalDays));
      const remainingMinutes = estimatedTotalMinutes - elapsedMinutes;
      
      console.log(`
Progress: ${percentComplete}% (${daysProcessed}/${totalDays} days)
Current date: ${currentDate.toISOString()}
Total logs generated: ${totalLogs.toLocaleString()}
Generation rate: ${logsPerSecond.toLocaleString()} logs/second
Estimated time remaining: ${Math.round(remainingMinutes)} minutes
-------------------------------------------`);
      
      lastProgressUpdate = Date.now();
      lastLogCount = totalLogs;
    }
    
    currentDate = new Date(currentDate.getTime() + 1000); // Add 1 second
  }
  
  // Close the stream properly
  await gzip.end();
  
  const totalTimeMinutes = (Date.now() - startTime) / 1000 / 60;
  console.log(`
Generation completed!
Total logs generated: ${totalLogs.toLocaleString()}
Total time: ${Math.round(totalTimeMinutes)} minutes
Average rate: ${Math.floor(totalLogs / (totalTimeMinutes * 60)).toLocaleString()} logs/second`);
}

// Generate logs for the specified period
const startDate = new Date('2024-12-01T00:00:00.000Z');
const endDate = new Date('2025-03-01T00:00:00.000Z');
const baseLogsPerSecond = 200;

console.log(`Starting log generation from ${startDate.toISOString()} to ${endDate.toISOString()}`);
console.log(`Base rate: ${baseLogsPerSecond} logs/second`);

generateLogs(startDate, endDate, baseLogsPerSecond).then(() => {
  console.log('Log generation completed');
}); 