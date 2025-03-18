import { AnyZodObject } from 'zod'; // Ensure you have the correct import for Zod
import { Request, Response, NextFunction } from 'express';

export const validate = (schema: AnyZodObject) =>
  async (request: Request, response: Response, next: NextFunction) => {
    // Validate request.body instead of request.query
    const result = await schema.safeParseAsync(request.body);

    if (result.success) {
      // Attach validated data to the request object
      request.body = result.data; // Overwrite request.body with validated data
      return next(); // Pass control to the next middleware
    } else {
      return response.status(400).json({
        message: "Validation Error",
        errors: result.error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        })),
      });
    }
  };