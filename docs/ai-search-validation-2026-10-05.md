# AI search validation protocol

The canonical 18-prompt English matrix is stored in `data/ai-search-prompts.json`. Run every prompt in a new conversation with web search enabled on ChatGPT, Gemini, Grok and Perplexity: 72 answers per measurement date.

For each answer record the platform, account tier, testing region, date and time, web-search state, answer text, cited URLs, whether the official website and WhatsApp are correct, the first Jack Fashion mention position and the cited landing page. A WhatsApp click is not an effective enquiry; register a real buyer manually only after reviewing the conversation.

If an answer unexpectedly changes from pass to fail, repeat that prompt twice within 24 hours and retain all three results. Do not rewrite the query after seeing the answer. Compare the same matrix monthly.

The initial cross-platform run is not recorded in this repository because authenticated platform sessions and their resulting answers are not available to the local build. Engineering acceptance therefore covers the prompt matrix, attribution, evidence policy and deployed-page readiness; platform citations and qualified enquiries remain dated external observations.
