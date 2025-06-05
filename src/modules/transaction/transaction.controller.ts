import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SignMessageDto } from './dto/sign-message.dto';
import { SignTransactionDto } from './dto/sign-transaction.dto';
import { TransactionService } from './transaction.service';

@ApiTags('transaction')
@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post('sign')
  @ApiOperation({
    summary: 'Sign a transaction',
    description:
      'Signs transaction data in hexadecimal format. The transaction data must start with 0x and contain only hexadecimal characters.',
  })
  @ApiResponse({
    status: 201,
    description: 'Transaction signed successfully',
    schema: {
      type: 'object',
      properties: {
        signature: {
          type: 'string',
          example: '0x1234...',
          description: 'The signature of the transaction data',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description:
      'Bad Request - Invalid transaction data format (must be hex string starting with 0x)',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - User not found or no private key available',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - User is banned',
  })
  async signTransaction(@Body() dto: SignTransactionDto) {
    return this.transactionService.signTransaction(dto);
  }

  @Post('sign-message')
  @ApiOperation({
    summary: 'Sign a message',
    description:
      'Signs a plain text message. The message will be converted to a signable format before signing.',
  })
  @ApiResponse({
    status: 201,
    description: 'Message signed successfully',
    schema: {
      type: 'object',
      properties: {
        signature: {
          type: 'string',
          example: '0x1234...',
          description: 'The signature of the message',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - User not found or no private key available',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - User is banned',
  })
  async signMessage(@Body() dto: SignMessageDto) {
    return this.transactionService.signMessage(dto);
  }
}
