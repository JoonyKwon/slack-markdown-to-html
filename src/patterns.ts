// @ts-ignore
import XRegExp from 'xregexp';
import { IPatternOptions } from './types';

export const closingDivPatternString = '</div>';
export const closingSpanPatternString = '</span>';
export const codeDivOpeningPatternString = '<pre><code>';
export const codeDivClosingPatternString = '</code></pre>';
export const codeSpanOpeningPatternString = '<code>';
export const codeSpanClosingPatternString = '</code>';
export const boldOpeningPatternString = '<b>';
export const boldClosingPatternString = '</b>';
export const strikethroughOpeningPatternString = '<s>';
export const strikethroughClosingPatternString = '</s>';
export const italicOpeningPatternString = '<i>';
export const italicClosingPatternString = '</i>';
export const blockDivOpeningPatternString = '<blockquote>';
export const blockDivClosingPatternString = '</blockquote>';
export const lineBreakTagLiteral = '<br>';

export const newlinePattern = new XRegExp('\\n', 'g');
// https://api.slack.com/docs/message-formatting
export const userMentionPattern = new XRegExp(
    '<@(((?<userID>U[^|>]+)(\\|(?<userName>[^>]+))?)|(?<userNameWithoutID>[^>]+))>',
    'ng',
);
export const channelMentionPattern = new XRegExp(
    '<#(((?<channelID>C[^|>]+)(\\|(?<channelName>[^>]+))?)|(?<channelNameWithoutID>[^>]+))>',
    'ng',
);
export const linkPattern = new XRegExp('<(?<linkUrl>https?:[^|>]+)(\\|(?<linkHtml>[^>]+))?>', 'ng');
export const mailToPattern = new XRegExp('<mailto:(?<mailTo>[^|>]+)(\\|(?<mailToName>[^>]+))?>', 'ng');
export const subteamCommandPattern = new XRegExp('<!subteam\\^(?<subteamID>S[^|>]+)(\\|(?<subteamName>[^>]+))?>', 'ng');
export const commandPattern = new XRegExp('<!(?<commandLiteral>[^|>]+)(\\|(?<commandName>[^>]+))?>', 'ng');

export const emojiPattern = new XRegExp(':(?<key>[^\\s,:]+):', 'ng');
export const emojiAliasPattern = new XRegExp('^alias:(?<aliasName>\\S+)$', 'n');

const buildOpeningDelimiterRegExp = (delimiter: string, options: IPatternOptions = {}) => {
    const anchorPattern = '(?<=^|\\n)';
    const noAlphaNumericPadPattern = '(?<=^|[^A-Za-z0-9])';
    const noQuoteOrAlphaPadPattern = options.noQuotePad ? "(?<=^|[^'`A-Za-z0-9])" : noAlphaNumericPadPattern;
    const openingWhitespacePattern = options.openingWhitespace ? '(?<openingCapturedWhitespace>^|\\s*)' : '';
    const characterPadPattern = options.allowCharacterPad ? '' : noQuoteOrAlphaPadPattern;
    const startPattern = options.startAnchored ? anchorPattern : characterPadPattern;
    return new XRegExp(`${startPattern}${delimiter}${openingWhitespacePattern}(?=\\S)`, 'n');
};

const buildClosingDelimiterRegExp = (delimiter: string, options: IPatternOptions = {}) => {
    const closingWhitespacePattern = options.closingWhitespace ? '(?<closingCapturedWhitespace>\\s*)' : '';
    const noAlphaNumericPadPattern = '(?=$|[^A-Za-z0-9])';
    const noQuoteOrAlphaPadPattern = options.noQuotePad ? "(?=$|[^'`A-Za-z0-9])" : noAlphaNumericPadPattern;
    const endPattern = options.allowCharacterPad ? '' : noQuoteOrAlphaPadPattern;
    return new XRegExp(`(?<=\\S)${closingWhitespacePattern}${delimiter}${endPattern}`, 'n');
};

export const blockCodeDelimiter = '```';
export const inlineCodeDelimiter = '`';
export const boldDelimiter = '*';
export const strikethroughDelimiter = '~';
export const italicDelimiter = '_';
export const blockQuoteDelimiter = '&gt;';

export const blockCodeOpeningPattern = buildOpeningDelimiterRegExp(XRegExp.escape(blockCodeDelimiter), {
    noQuotePad: true,
    openingWhitespace: true,
});

export const blockCodeClosingPattern = buildClosingDelimiterRegExp(XRegExp.escape('```'), {
    closingWhitespace: true,
    noQuotePad: true,
});

export const inlineCodeOpeningPattern = buildOpeningDelimiterRegExp(XRegExp.escape(inlineCodeDelimiter), {
    allowCharacterPad: true,
    openingWhitespace: true,
});

export const inlineCodeClosingPattern = buildClosingDelimiterRegExp(XRegExp.escape(inlineCodeDelimiter), {
    allowCharacterPad: true,
    noQuotePad: true,
    closingWhitespace: true,
});

export const boldOpeningPattern = buildOpeningDelimiterRegExp(XRegExp.escape(boldDelimiter));

export const boldClosingPattern = buildClosingDelimiterRegExp(XRegExp.escape(boldDelimiter), {
    closingWhitespace: true,
});

export const strikethroughOpeningPattern = buildOpeningDelimiterRegExp(XRegExp.escape(strikethroughDelimiter), {
    openingWhitespace: true,
});

export const strikethroughClosingPattern = buildClosingDelimiterRegExp(XRegExp.escape(strikethroughDelimiter));

export const italicOpeningPattern = buildOpeningDelimiterRegExp(XRegExp.escape(italicDelimiter), {
    openingWhitespace: true,
});

export const italicClosingPattern = buildClosingDelimiterRegExp(XRegExp.escape(italicDelimiter), {
    closingWhitespace: true,
});

export const blockQuoteOpeningPattern = buildOpeningDelimiterRegExp(XRegExp.escape(blockQuoteDelimiter), {
    openingWhitespace: true,
    startAnchored: true,
});

export const blockQuoteClosingPattern = new XRegExp('\\n|$');
