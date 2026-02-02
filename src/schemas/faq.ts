import type { FAQPage, WithContext } from 'schema-dts';

import type { FaqQuestionInput } from '../types';
import { warnDev } from '../utils';
import { isNonEmptyString, warnSchema } from '../schema-utils';

/**
 * FAQPage schema helper.
 */
export const faqPageSchema = (
  questions: FaqQuestionInput[]
): WithContext<FAQPage> | undefined => {
  if (!questions.length) {
    warnSchema('faq-empty', 'FAQ schema requires at least one question.');
    return undefined;
  }

  if (questions.length > 10) {
    warnDev(
      'faq-size',
      'FAQ schema includes more than 10 questions. Consider trimming for best results.'
    );
  }

  questions.forEach((question, index) => {
    if (!isNonEmptyString(question.question)) {
      warnSchema(`faq-question-${index}`, 'FAQ schema question text is missing.');
    }
    if (!isNonEmptyString(question.answer)) {
      warnSchema(`faq-answer-${index}`, 'FAQ schema answer text is missing.');
    }
  });

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
