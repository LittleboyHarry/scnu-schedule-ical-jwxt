import React, { ReactNode } from 'react';
import unified from 'unified';
import parser from 'remark-parse';
import toc from 'mdast-util-toc';
import slug4remark from 'remark-slug';
// import slug4rehype from 'rehype-slug'
import remark2rehype from 'remark-rehype';
import rehype2react from 'rehype-react';

export interface ContentWithTocNodesSet {
  body: ReactNode;
  toc: ReactNode;
}

const processes = {
  body: unified()
    .use(parser)
    .use(slug4remark)
    .use(remark2rehype)
    .use(rehype2react, { createElement: React.createElement }),
  toc: unified()
    .use(parser)
    .use(() => (tree, file) => {
      const root = toc(tree).map!;
      tree['children'] = [root];
      root.children = root.children[0].children[1].children as typeof root.children;
    })
    .use(remark2rehype)
    // .use(slug4rehype)
    .use(rehype2react, { createElement: React.createElement })
};

export default class MarkdownParser {
  public static convert(raw: String): ContentWithTocNodesSet {
    return {
      body: processes.body.processSync(raw).contents,
      toc: processes.toc.processSync(raw).contents
    };
  }
}
