import { Request, Response } from 'express';
import { ComplianceFactory } from '../factories/complianceFactory.ts';

export const verifyGlobalCompliance = async (req: Request, res: Response): Promise<void> => {
  try {
    // Extract country and language from headers or query params or body
    const countryCode = (req.headers['x-country-code'] as string) || (req.query.countryCode as string) || req.body?.countryCode || 'GLOBAL';
    const lang = (req.headers['accept-language'] as string) || (req.query.lang as string) || req.body?.lang || 'en';

    const { credits, hours } = req.body;

    if (credits === undefined || hours === undefined) {
      res.status(400).json({ error: 'Missing performance metrics.' });
      return;
    }

    // Dynamic resolution based on country code
    const strategy = ComplianceFactory.getStrategy(countryCode);
    const evaluation = strategy.validateCPD(Number(credits), Number(hours));

    // Simple structural translation layer framework setup (supports Afaan Oromoo and English)
    const localizedMessage = evaluation.isValid 
      ? (lang.startsWith('om') ? 'Galmeen keessan guutudha.' : 'Your status is fully compliant.')
      : (lang.startsWith('om') ? 'Giddu-galeessi keessan hin guunne.' : 'Action required: Requirements not met.');

    res.status(200).json({
      countryCode,
      status: localizedMessage,
      details: evaluation
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal system error processing global compliance strategy.' });
  }
};
