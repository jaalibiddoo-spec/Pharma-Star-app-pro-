import { Request, Response } from 'express';
import { ComplianceFactory } from '../factories/complianceFactory.ts';

export const verifyGlobalCompliance = async (req: Request, res: Response): Promise<void> => {
  try {
    // Extract country and language from headers or query params or body
    const countryCode = (req.headers['x-country-code'] as string) || (req.query.countryCode as string) || req.body?.countryCode || 'GLOBAL';
    const lang = (req.headers['accept-language'] as string) || (req.query.lang as string) || req.body?.lang || 'en';

    const { credits, hours, ethicsCredits } = req.body;

    if (credits === undefined || hours === undefined) {
      res.status(400).json({ error: 'Missing performance metrics.' });
      return;
    }

    // Dynamic resolution based on country code
    const strategy = ComplianceFactory.getStrategy(countryCode);
    const evaluation = strategy.validateCPD(Number(credits), Number(hours), ethicsCredits !== undefined ? Number(ethicsCredits) : 0);

    // Multi-language translation layer (Afaan Oromoo, Amharic, French, Arabic, Spanish, English)
    let localizedMessage = 'Your status is fully compliant for license renewal.';
    if (evaluation.isValid) {
      if (lang.startsWith('om')) localizedMessage = 'Galmeen keessan guutudha.';
      else if (lang.startsWith('am')) localizedMessage = 'የሙያ ፈቃድ ማደሻ መስፈርትዎን ሙሉ በሙሉ አሟልተዋል።';
      else if (lang.startsWith('fr')) localizedMessage = 'Votre statut est entièrement conforme pour le renouvellement.';
      else if (lang.startsWith('ar')) localizedMessage = 'وضعك ممتثل تمامًا لمتطلبات تجديد الترخيص المهني.';
      else if (lang.startsWith('es')) localizedMessage = 'Su estado cumple plenamente con los requisitos de renovación.';
    } else {
      if (lang.startsWith('om')) localizedMessage = 'Giddu-galeessi keessan hin guunne.';
      else if (lang.startsWith('am')) localizedMessage = 'አስፈላጊ መስፈርቶች አልተሟሉም፡ እባክዎ ተጨማሪ ክሬዲቶችን ያጠናቅቁ።';
      else if (lang.startsWith('fr')) localizedMessage = 'Action requise : Les exigences de DPC ne sont pas remplies.';
      else if (lang.startsWith('ar')) localizedMessage = 'مطلوب اتخاذ إجراء: لم يتم استيفاء المتطلبات اللازمة.';
      else if (lang.startsWith('es')) localizedMessage = 'Acción requerida: No se cumplen todos los requisitos.';
      else localizedMessage = 'Action required: Continuing education requirements not yet met.';
    }

    res.status(200).json({
      countryCode,
      status: localizedMessage,
      details: evaluation
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal system error processing global compliance strategy.' });
  }
};
