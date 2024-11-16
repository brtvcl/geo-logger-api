import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsBoundaryValid(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsBoundaryValid',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          // Ensure value is an array of points
          if (!Array.isArray(value)) return false;

          // Validate each item in the array is a valid point
          for (const point of value) {
            if (
              typeof point.lat !== 'number' ||
              typeof point.lon !== 'number'
            ) {
              return false;
            }
          }

          // Minimum 4 points for a polygon
          if (value.length < 4) return false;
          // Maximum 1,000 points for a polygon
          if (value.length > 1000) return false;
          const firstPoint = value[0];
          const lastPoint = value[value.length - 1];
          // heck if the boundary forms a closed polygon)
          return (
            firstPoint.lat === lastPoint.lat && firstPoint.lon === lastPoint.lon
          );
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be an array of valid Point objects forming a closed polygon.`;
        },
      },
    });
  };
}
