import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import hljs from 'highlight.js';
import Clipboard from 'clipboard';
import { Message, Card, Layout, Button } from 'element-react';

import 'highlight.js/styles/github-gist.css';

const styles = {
  root: {
    position: 'absolute',
    bottom: 24,
    left: 120,
    width: '82%',
  },
  card: {
    position: 'relative'
  },
  copyBtn: {
    position: 'absolute',
    right: 12,
    top: '50%',
    transform: 'translateY(-50%)'
  }
}

export default class extends PureComponent {
  static displayName = 'CommandPreview';

  static propTypes = {
    commands: PropTypes.string,
  }

  static defaultProps = {
    commands: ''
  }

  componentDidMount() {
    hljs.configure({useBR: true});
    hljs.initHighlighting();

    const self = this;
    this.clipboard = new Clipboard('.copyButton', {
      target () {
        return document.getElementsByClassName('copyButton')[0];
      },
      text () {
        const { commands } = self.props;
        return commands;
      }
    });
    this.clipboard.on('success', function(e) {
      Message({
        message: `Congrats, command ${e.action} successfully.`,
        type: 'success'
      });
      e.clearSelection();
    });

    this.clipboard.on('error', function(e) {
      Message.error(`Oops, error when try ${e.action} the command.`);
    });

  }

  componentWillUnmount() {
    this.clipboard.destroy();
  }

  render() {
    const { commands }  = this.props;
    const w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    styles.root.width = w - 210;

    const clipboardCopyIsSupport = Clipboard.isSupported();

    return (<Layout.Row style={styles.root}>
      <Layout.Col span="24">
        <div className="grid-content bg-purple-dark">
          <Card className="box-card" style={styles.card}>
            <pre>
              <code className="shell">
                {hljs.highlight('shell', commands).value}
              </code>
            </pre>
            {clipboardCopyIsSupport &&
              <Button
                type="primary"
                icon="document"
                className="copyButton"
                style={styles.copyBtn}>
              </Button>
            }
          </Card>
        </div>
      </Layout.Col>
    </Layout.Row>)
  }
}
