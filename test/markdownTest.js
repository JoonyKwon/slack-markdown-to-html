import { escapeForSlackWithMarkdown } from '../src/index.ts';

describe('markdown', () => {
  describe('code multiline', () => {
    it('should render an element', () => {
      escapeForSlackWithMarkdown('```this is a code multiline```').should.equal(
        '<pre><code>this is a code multiline</code></pre>',
      );
    });

    it('should convert newlines', () => {
      escapeForSlackWithMarkdown('```this is a code multiline\nwith newlines```').should.equal(
        '<pre><code>this is a code multiline\nwith newlines</code></pre>',
      );
    });

    it('should greedily capture backticks', () => {
      escapeForSlackWithMarkdown('````this is a code multiline with backticks````').should.equal(
        '<pre><code>`this is a code multiline with backticks`</code></pre>',
      );
    });

    it('should not capture whitespace', () => {
      escapeForSlackWithMarkdown('```this is a code multiline``` ```and this is another```').should.equal(
        '<pre><code>this is a code multiline</code></pre> <pre><code>and this is another</code></pre>',
      );
    });

    it('should not apply markdown to text within a code block', () => {
      escapeForSlackWithMarkdown('```this is a code multiline with *asterisks*```').should.equal(
        '<pre><code>this is a code multiline with *asterisks*</code></pre>',
      );
    });

    it('should not affect markdown after the code block', () => {
      escapeForSlackWithMarkdown('```this is a code multiline``` with some *bold* text after it').should.equal(
        '<pre><code>this is a code multiline</code></pre> with some <b>bold</b> text after it',
      );
    });
  });

  describe('code inline', () => {
    it('should render an element', () => {
      escapeForSlackWithMarkdown('`this is a code inline`').should.equal(
        '<code>this is a code inline</code>',
      );
    });

    it('should not greedily capture backticks', () => {
      escapeForSlackWithMarkdown('`this is code``this is not').should.equal(
        '<code>this is code</code>`this is not',
      );
    });
  });

  describe('bold', () => {
    it('should render an element', () => {
      escapeForSlackWithMarkdown('this is *bold*').should.equal('this is <b>bold</b>');
    });

    context('with spaces in between asterisks', () => {
      it('should capture as much as possible', () => {
        escapeForSlackWithMarkdown('this is *bold * with * more * asterisks*').should.equal(
          'this is <b>bold</b> with * more * asterisks*',
        );
      });
    });

    context('when next to another character', () => {
      it('should not replace the bold delimiters', () => {
        escapeForSlackWithMarkdown('a*this is not bold*').should.equal('a*this is not bold*');
      });
    });
  });

  describe('italic', () => {
    it('should render an element', () => {
      escapeForSlackWithMarkdown('this is _italic_').should.equal('this is <i>italic</i>');
    });

    context('when next to another character', () => {
      it('should not replace the delimiters', () => {
        escapeForSlackWithMarkdown('this_is not italic_').should.equal('this_is not italic_');
      });

      it('should replace space padded delimiters', () => {
        escapeForSlackWithMarkdown('this _is_italic_').should.equal(
          'this <i>is_italic</i>',
        );
      });
    });
  });

  describe('strikethrough', () => {
    it('should render an element', () => {
      escapeForSlackWithMarkdown('this is ~struck~').should.equal(
        'this is <s>struck</s>',
      );
    });

    context('with a closing whitespace', () => {
      it('should not render an element', () => {
        escapeForSlackWithMarkdown('this is ~not struck ~').should.equal('this is ~not struck ~');
      });
    });
  });

  describe('block quote', () => {
    it('should render an element', () => {
      escapeForSlackWithMarkdown('&gt; this is a block quote').should.equal(
        '<blockquote> this is a block quote</blockquote>',
      );
    });

    it('should render an element with bold', () => {
      escapeForSlackWithMarkdown('&gt; this *is a* block quote').should.equal(
        '<blockquote> this <b>is a</b> block quote</blockquote>',
      );
    });

    /* TODO: Fix this function
    it('should replace newlines', () => {
      escapeForSlackWithMarkdown('&gt; this is a block quote\n&gt; with newlines').should.equal(
        '<blockquote> this is a block quote<br> with newlines</blockquote>',
      );
    });
    */
  });
  describe('mixed markdown', () => {
    context('bold and italic', () => {
      it('should replace both', () => {
        escapeForSlackWithMarkdown('*_bold and italic_*').should.equal(
          '<b><i>bold and italic</i></b>',
        );
      });
    });

    context('italic and bold', () => {
      it('should replace both', () => {
        escapeForSlackWithMarkdown('_*italic and bold*_').should.equal(
          '<i><b>italic and bold</b></i>'
        );
      });
    });

    context.skip('when delimiters are mismatched', () => {
      it('should respect precedence', () => {
        escapeForSlackWithMarkdown('*~this is bold*~').should.equal('<b>~this is bold</b>~');
      });

      it('should not replace invalid delimiters', () => {
        escapeForSlackWithMarkdown('~*this is bold~*').should.equal('~*this is bold~*');
      });
    });
  });
});
