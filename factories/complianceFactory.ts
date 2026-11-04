import { ComplianceStrategy } from '../strategies/types.ts';
import { EthiopiaComplianceStrategy } from '../strategies/ethiopiaStrategy.ts';
import { GenericGlobalStrategy } from '../strategies/genericGlobalStrategy.ts';

export class ComplianceFactory {
  static getStrategy(countryCode: string): ComplianceStrategy {
    switch ((countryCode || '').toUpperCase()) {
      case 'ET':
        return new EthiopiaComplianceStrategy();
      default:
        return new GenericGlobalStrategy();
    }
  }
}
