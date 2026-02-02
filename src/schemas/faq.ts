import type { FAQPage, WithContext } from 'schema-dts';

import type { FaqQuestionInput } from '../types';
import { warnDev } from '../utils';

/**
 * FAQPage schema helper.
 */
export const faqPageSchema = (questions: FaqQuestionInput[]): WithContext<FAQPage> => {
  if (questions.length > 10) {
    warnDev(
      'faq-size',
      'FAQ schema includes more than 10 questions. Consider trimming for best results.'
    );
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map((question) => ({
      '@type': 'Question',
      name: question.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: question.answer,
      },
    })),
  };
};
