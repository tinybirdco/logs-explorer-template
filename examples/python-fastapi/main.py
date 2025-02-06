from fastapi import FastAPI, Response, Request, status
import logger

app = FastAPI()


@app.get("/getProductExample", status_code=200)
def getProductExample(request: Request, response: Response, product_id: int | None = None):
    if not product_id:
        logger.error('No product_id param provided', request)
        response.status_code = status.HTTP_400_BAD_REQUEST
        return {"error": "You didn't provide a product_id!"}
    else:
        logger.info(f'getProduct:{product_id}', request)
        message = f'API call for getProduct:{product_id} was tracked.'
        return {"success": message}
