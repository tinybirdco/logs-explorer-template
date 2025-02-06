import requests
import os
import json
from datetime import datetime
from dotenv import load_dotenv
from fastapi import Request
from user_agents import parse as ua_parse

load_dotenv()


def info(message, request):
    log(request, 'INFO', message)


def warn(message, request):
    log(request, 'WARN', message)


def error(message, request):
    log(request, 'ERROR', message)


def log(req: Request, log_level, log_message):
    user_agent = ua_parse(req.headers['user-agent'])
    data = {
        "event_ts": datetime.now().isoformat(),
        "ip_address": req.client.host,
        "city": 'unknown',
        "country": 'unknown',
        "region": 'unknown',
        "latitude": 'unknown',
        "longitude": 'unknown',
        "protocol": req.headers['x-forwarded-proto'] if req.headers.get('x-forwarded-proto') else 'unknown',
        "method": req.method,
        "host": req.headers['host'],
        "url": f'{req.url.scheme}//:{req.headers["host"]}{req.url.path}',
        "headers": ','.join(req.headers.keys()),
        "useragent": req.headers['user-agent'] if req.headers.get('user-agent') else 'unknown',
        "referer": req.headers['referer'] if req.headers.get('referer') else 'unknown',
        "acceptencoding": req.headers['accept-encoding'] if req.headers.get('accept-encoding') else 'unknown',
        "acceptlanguage": req.headers['accept-language'] if req.headers.get('accept-language') else 'unknown',
        "acceptcharset": req.headers['accept-charset'] if req.headers.get('accept-charset') else 'unknown',
        "origin": req.headers['origin'] if req.headers.get('origin') else 'unknown',
        "xforwaredforip": req.headers['x-forwarded-for'] if req.headers.get('x-forwarded-for') else 'unknown',
        "connection": req.headers['connection'] if req.headers.get('connection') else 'unknown',
        "cachecontrol": req.headers['cache-control'] if req.headers.get('cache-control') else 'unknown',
        "contenttype": req.headers['content-type'] if req.headers.get('content-type') else 'unknown',
        "from": req.headers['from'] if req.headers.get('from') else 'unknown',
        "via": req.headers['via'] if req.headers.get('via') else 'unknown',
        "contentlength": req.headers['content-length'] if req.headers.get('content-length') else 'unknown',
        "isbot": 0,
        "browsername": user_agent.browser.family if user_agent.browser.family else 'unknown',
        "browserversion": user_agent.browser.version_string if user_agent.browser.version_string else 'unknown',
        "devicemodel": user_agent.device.model if user_agent.device.model else 'unknown',
        "devicetype": user_agent.device.family if user_agent.device.family else 'unknown',
        "devicevendor": user_agent.device.brand if user_agent.device.brand else 'unknown',
        "enginename": 'unknown',
        "engineversion": 'unknown',
        "osname": user_agent.os.family if user_agent.os.family else 'unknown',
        "osversion": user_agent.os.version_string if user_agent.os.version_string else 'unknown',
        "cpuarchitecture": 'unknown',
        "log_level": log_level,
        "log_message": log_message,
    }
    send_to_tinybird(data)


def send_to_tinybird(data):
    r = requests.post('https://api.tinybird.co/v0/events?name=logs',
                      params={
                          'token': os.getenv('TINYBIRD_TOKEN'),
                      },
                      data=json.dumps(data))
    return True
