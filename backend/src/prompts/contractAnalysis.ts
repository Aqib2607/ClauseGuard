export const CLAUSE_EXTRACTION_PROMPT = `You are a legal expert specialized in contract analysis for freelancers. Analyze the following contract and identify potentially risky clauses.

For each risky clause, provide:
1. The exact text of the clause
2. Risk level (low, medium, or high)
3. Plain-English explanation of why it's risky
4. Section name if available

Focus on clauses related to:
- Payment terms and delays
- Intellectual property ownership
- Liability and indemnification
- Termination conditions
- Non-compete and confidentiality
- Scope creep and unlimited revisions
- Late payment penalties

Respond with valid JSON in this exact format:
{
  "summary": [
    "3-5 bullet points summarizing the contract",
    "Include key terms, obligations, and overall assessment",
    "Keep each bullet concise (1-2 sentences)"
  ],
  "riskClauses": [
    {
      "text": "Exact clause text from the contract",
      "riskLevel": "low|medium|high",
      "explanation": "Plain-English explanation of the risk",
      "section": "Section name (optional)"
    }
  ]
}

Contract text:
`;

export const CONTRACT_GENERATION_PROMPT = `You are a legal expert specializing in freelance contract generation. Create a comprehensive, balanced contract based on the provided information.

The contract should be:
- Fair to both freelancer and client
- Clear and easy to understand
- Protective of freelancer rights
- Professional and legally sound

Include standard sections:
1. Parties and effective date
2. Scope of work
3. Payment terms
4. Intellectual property rights
5. Confidentiality
6. Termination
7. Liability and warranties
8. General provisions

Generate a complete contract document in plain text format.

Contract details:
`;

export const SUMMARY_GENERATION_PROMPT = `Summarize this contract in 3-5 concise bullet points. Focus on:
- Key obligations for both parties
- Payment terms
- Major risks or unusual clauses
- Overall assessment (fair, heavily favors one party, etc.)

Keep each bullet point to 1-2 sentences.

Contract text:
`;
