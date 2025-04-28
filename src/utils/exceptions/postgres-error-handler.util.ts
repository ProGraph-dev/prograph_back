import { PostgresStatusCode } from './postgres-error-codes.enum';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

export function handlePostgresError(error: any): never {
  const code = error?.code;
  switch (code) {
    case PostgresStatusCode.UNIQUE_VIOLATION:
      throw new ConflictException('Resource already exists.');
    case PostgresStatusCode.NOT_NULL_VIOLATION:
      throw new BadRequestException('A required field is missing.');
    case PostgresStatusCode.FOREIGN_KEY_VIOLATION:
      throw new BadRequestException('Invalid foreign key reference.');
    case PostgresStatusCode.CHECK_VIOLATION:
      throw new BadRequestException('Check constraint failed.');
    case PostgresStatusCode.CARDINALITY_VIOLATION:
      throw new BadRequestException('Too many or too few results.');
    case PostgresStatusCode.STRING_DATA_RIGHT_TRUNCATION:
      throw new BadRequestException('String is too long.');
    case PostgresStatusCode.NUMERIC_VALUE_OUT_OF_RANGE:
      throw new BadRequestException('Number is out of allowed range.');
    case PostgresStatusCode.NULL_VALUE_NOT_ALLOWED:
      throw new BadRequestException('Null value not allowed in this column.');
    case PostgresStatusCode.INVALID_TRANSACTION_INITIATION:
    case PostgresStatusCode.INVALID_TRANSACTION_STATE:
    case PostgresStatusCode.INVALID_TRANSACTION_TERMINATION:
      throw new BadRequestException('Invalid transaction state.');
    case PostgresStatusCode.CONNECTION_EXCEPTION:
    case PostgresStatusCode.CONNECTION_DOES_NOT_EXIST:
    case PostgresStatusCode.CONNECTION_FAILURE:
    case PostgresStatusCode.TRANSACTION_RESOLUTION_UNKNOWN:
    case PostgresStatusCode.PROTOCOL_VIOLATION:
      throw new InternalServerErrorException('Database connection issue.');
    case PostgresStatusCode.INVALID_AUTHORIZATION_SPECIFICATION:
    case PostgresStatusCode.INSUFFICIENT_PRIVILEGE:
      throw new UnauthorizedException('Insufficient database privileges.');
    case PostgresStatusCode.UNDEFINED_TABLE:
    case PostgresStatusCode.UNDEFINED_COLUMN:
    case PostgresStatusCode.UNDEFINED_FUNCTION:
    case PostgresStatusCode.CASE_NOT_FOUND:
    case PostgresStatusCode.INVALID_COLUMN_REFERENCE:
      throw new NotFoundException('Referenced entity does not exist.');
    case PostgresStatusCode.DUPLICATE_COLUMN:
    case PostgresStatusCode.DUPLICATE_TABLE:
      throw new ConflictException('Duplicate column or table.');
    case PostgresStatusCode.AMBIGUOUS_COLUMN:
      throw new BadRequestException('Ambiguous column reference.');
    case PostgresStatusCode.SYNTAX_ERROR:
    case PostgresStatusCode.SYNTAX_ERROR_OR_ACCESS_RULE_VIOLATION:
      throw new BadRequestException('SQL syntax error.');
    case PostgresStatusCode.INVALID_CURSOR_NAME:
    case PostgresStatusCode.INVALID_CURSOR_STATE:
      throw new BadRequestException('Invalid database cursor operation.');
    case PostgresStatusCode.INVALID_GRANTOR:
    case PostgresStatusCode.INVALID_ROLE_SPECIFICATION:
      throw new ForbiddenException('Invalid grantor or role.');
    case PostgresStatusCode.WITH_CHECK_OPTION_VIOLATION:
      throw new BadRequestException('WITH CHECK OPTION violation.');
    case PostgresStatusCode.INVALID_JSON_TEXT:
    case PostgresStatusCode.INVALID_XML_DOCUMENT:
    case PostgresStatusCode.INVALID_ESCAPE_CHARACTER:
      throw new BadRequestException('Invalid document or character format.');
    case PostgresStatusCode.INTERNAL_ERROR:
      throw new InternalServerErrorException('Internal database error.');
    default:
      throw error;
  }
}
