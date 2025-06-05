import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SignTransactionDto } from './dto/sign-transaction.dto';
import { TransactionService } from './transaction.service';

@ApiTags('transaction')
@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post('sign')
  @ApiOperation({ summary: 'Sign a transaction' })
  @ApiResponse({
    status: 200,
    description: 'Transaction signed successfully',
    schema: {
      type: 'object',
      properties: {
        signature: {
          type: 'string',
          example: '0x...',
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async signTransaction(@Body() dto: SignTransactionDto) {
    return this.transactionService.signTransaction(dto);
  }
}
