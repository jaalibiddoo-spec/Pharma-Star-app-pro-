import { ComplianceStrategy } from '../strategies/types.ts';
import { EthiopiaComplianceStrategy } from '../strategies/ethiopiaStrategy.ts';
import { GenericGlobalStrategy } from '../strategies/genericGlobalStrategy.ts';
import { 
  USAComplianceStrategy, 
  UKComplianceStrategy, 
  CanadaComplianceStrategy, 
  AustraliaComplianceStrategy, 
  UAEGulfComplianceStrategy, 
  KenyaComplianceStrategy, 
  NigeriaComplianceStrategy 
} from '../strategies/internationalStrategies.ts';

export class ComplianceFactory {
  static getStrategy(countryCode: string): ComplianceStrategy {
    switch ((countryCode || '').toUpperCase()) {
      case 'ET':
      case 'ETH':
      case 'ETHIOPIA':
        return new EthiopiaComplianceStrategy();
      case 'US':
      case 'USA':
      case 'UNITED STATES':
        return new USAComplianceStrategy();
      case 'GB':
      case 'UK':
      case 'GBR':
      case 'UNITED KINGDOM':
        return new UKComplianceStrategy();
      case 'CA':
      case 'CAN':
      case 'CANADA':
        return new CanadaComplianceStrategy();
      case 'AU':
      case 'AUS':
      case 'AUSTRALIA':
        return new AustraliaComplianceStrategy();
      case 'AE':
      case 'ARE':
      case 'UAE':
      case 'SA':
      case 'SAU':
      case 'GULF':
        return new UAEGulfComplianceStrategy();
      case 'KE':
      case 'KEN':
      case 'KENYA':
        return new KenyaComplianceStrategy();
      case 'NG':
      case 'NGA':
      case 'NIGERIA':
        return new NigeriaComplianceStrategy();
      default:
        return new GenericGlobalStrategy();
    }
  }
}
