import { NextRequest } from 'next/server'
import { logger } from '../logger'

/*
 *
 * This is an example Vercel Edge Function.
 * It shows how you can use the sample TypeScript Logger in your code to capture logs.
 * You can deploy this function to Vercel to try it out.
 * When you hit the API that invokes this function, it will look for a 'product_id' query parameter.
 * If you provide the query parameter, it will create an INFO level log.
 * If you do NOT provide the query paramter, it will create an ERROR level log.
 * 
*/

const getProduct = (req: NextRequest) => {
  const { searchParams } = new URL(req.url)
  const product_id = searchParams.get('product_id')

  if (!product_id || product_id === null) {
    logger.error("No product_id param provided", req)

    return new Response(
      JSON.stringify({
        error: "You didn't provide a product_id!",
      }),
      {
        status: 400,
        headers: {
          'content-type': 'application/json',
        },
      }
    )
  } else {
    logger.info(`getProduct:${product_id}`, req)

    return new Response(
      JSON.stringify({
        success: `API call for getProduct:${product_id} was tracked.`,
      }),
      {
        status: 200,
        headers: {
          'content-type': 'application/json',
        },
      }
    )
  }
}

export default getProduct

export const config = {
  runtime: 'experimental-edge',
}
