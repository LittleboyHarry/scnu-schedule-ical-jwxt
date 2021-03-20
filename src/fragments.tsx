import { faBars, faCopy } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAsync, useInViewport, useResponsive, useSize, useToggle } from '@umijs/hooks';
import {
  Affix,
  Button,
  Checkbox,
  Collapse,
  Drawer,
  Form,
  InputNumber,
  Layout,
  Menu,
  Result,
  Select,
  Skeleton,
  Switch,
  Tooltip
} from 'antd';
import copy from 'copy-to-clipboard';
import { motion, transform } from 'framer-motion';
import React, { CSSProperties, useEffect, useMemo, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { useScrollPercentage } from 'react-scroll-percentage';
import SmoothScroll from 'smooth-scroll';
import { getAppState, ProgressState, useAppState } from './AppState';
import { IntroductionImageSources } from './fragments.assets';
import Styles from './fragments.module.css';
import { useBodyScrollLock } from './hooks';
import MarkdownParser, { ContentWithTocNodesSet } from './MarkdownParser';
import { FinishCircle, mapFirstImgScale, mapPosX, mapSecondImgScale, marks } from './movieclips';
import * as Rules from './rules';

const { animateScroll } = new SmoothScroll();

const Section = React.forwardRef<
  HTMLElement,
  React.PropsWithChildren<{
    className?: string;
    style?: CSSProperties;
  }>
>(({ children, style, className }, ref) => {
  return (
    <section
      {...{ ref }}
      className={className ? `${Styles.Section} ${className}` : Styles.Section}
      {...{ children, style }}
    />
  );
});

function screenshotProps(id: number) {
  return {
    className: Styles.DisplayImage,
    alt: '展示效果',
    src: IntroductionImageSources[id - 1]
  };
}

enum MenuItemKey {
  Introduction,
  GettingStart,
  Help,
  AboutUs
}

export function Navbar() {
  const biggerThanXs = useResponsive().sm;
  const { state: collapsed, toggle: toggleCollapsed } = useToggle();
  const showingHelpDoc = useAppState((state) => state.showingHelpDoc);
  const [watchingGettingStart] = useInViewport(useAppState((state) => state.gettingStartElement));

  const menuItems = useMemo(
    () => [
      <Menu.Item
        onClick={() => {
          const appState = getAppState();
          appState.turnToIdle();
          appState.hideHelpDoc();
          animateScroll(getAppState().introductionElement);
          toggleCollapsed(false);
        }}
        key={`${MenuItemKey.Introduction}`}
      >
        介绍
      </Menu.Item>,
      <Menu.Item
        key={`${MenuItemKey.GettingStart}`}
        onClick={() => {
          const appState = getAppState();
          appState.turnToIdle();
          appState.hideHelpDoc();
          animateScroll(appState.gettingStartElement);
          toggleCollapsed(false);
        }}
      >
        立即使用
      </Menu.Item>,
      <Menu.Item
        onClick={() => {
          const appState = getAppState();
          appState.showHelpDoc();
          appState.turnToIdle();
          toggleCollapsed(false);
        }}
        key={`${MenuItemKey.Help}`}
      >
        帮助文档
      </Menu.Item>,
      <Menu.Item key={`${MenuItemKey.AboutUs}`}>
        <a href="https://i.scnu.edu.cn/" target="_about">
          关于我们
        </a>
      </Menu.Item>
    ],
    []
  );

  return (
    <>
      <Affix>
        <header>
          <Menu
            mode="horizontal"
            style={{ textAlign: 'right', padding: '0 2rem' }}
            selectedKeys={[
              showingHelpDoc
                ? `${MenuItemKey.Help}`
                : watchingGettingStart
                ? `${MenuItemKey.GettingStart}`
                : `${MenuItemKey.Introduction}`
            ]}
          >
            {biggerThanXs ? (
              [
                <Menu.Item
                  key={-1}
                  onClick={() => {
                    window.open('https://i.scnu.edu.cn/about/');
                  }}
                  style={{ float: 'left' }}
                >
                  <img src="logo.png" style={{ height: '1.75rem' }} />
                </Menu.Item>,
                ...menuItems
              ]
            ) : (
              <Menu.Item
                onClick={() => {
                  toggleCollapsed();
                }}
              >
                <FontAwesomeIcon icon={faBars} />
              </Menu.Item>
            )}
          </Menu>
        </header>
      </Affix>
      <Drawer
        visible={!biggerThanXs && collapsed}
        onClose={() => {
          toggleCollapsed(false);
        }}
        style={{ padding: 0 }}
      >
        <Menu mode="vertical" style={{ marginTop: 64, border: 0 }}>
          {menuItems}
        </Menu>
      </Drawer>
    </>
  );
}

export function Introduction() {
  const biggerThanMd = useResponsive().md;
  const [onSecondPage, secondPageRef] = useInViewport<HTMLDivElement>();
  const [thirdPageRef, _thirdPageRatio] = useScrollPercentage();
  const thirdPageRatio =
    transform(
      _thirdPageRatio,
      [0, 0.05, 0.45, 0.5, 0.7, 1],
      [0, marks.enterScreen, marks.beginFirstScale, marks.beginSecondScale, marks.endSecondScale, 1]
    ) ?? 0;
  const [{ width }] = useSize(() => document.querySelector('body')!);

  const firstImgX = mapPosX(thirdPageRatio, width ?? 1);
  const firstImgScale = mapFirstImgScale(thirdPageRatio);
  const secondImgX = mapPosX(thirdPageRatio, width ?? 1) + 64;
  const secondImgScale = mapSecondImgScale(thirdPageRatio);

  return (
    <div ref={(_) => getAppState().setIntroductionElement(_)}>
      <Section>
        <motion.div
          style={{ margin: '3rem 0 4rem' }}
          initial={{ y: -64, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <h1>绿色、简洁的校园日历</h1>
          <p>无需下载第三方APP、无流氓推广、没有多余的社交功能、耗电量极低，没有任何副作用</p>
        </motion.div>
        <div>
          <motion.div
            initial={{ y: 128, opacity: 0, scale: 0.9 }}
            animate={{
              y: 0,
              opacity: 1,
              scale: 1,
              transition: {
                duration: 0.8,
                delay: 1.6
              }
            }}
          >
            <img
              // whileHover={{ scale: 1.1, transition: { delay: 0.6 } }}
              style={{
                maxWidth: '90%',
                maxHeight: 420,
                boxShadow: '0px 16px 32px 4px #9E9E9E',
                borderRadius: 8,
                marginBottom: '2rem'
              }}
              {...screenshotProps(1)}
            />
          </motion.div>
        </div>
      </Section>
      <Section style={{ background: '#09f', color: 'white', padding: '3rem' }}>
        <h1 style={{ color: 'white' }}>跨平台的云课表</h1>
        <p style={{ paddingBottom: '2rem' }}>手机与电脑云端同步。随时随地在手机上查看我的课程！</p>
        <div ref={secondPageRef}>
          {biggerThanMd ? (
            <>
              <motion.img
                animate={{
                  x: onSecondPage ? 0 : -512
                }}
                transition={{ duration: 0.6 }}
                initial={{ originX: 0 }}
                whileHover={{ scale: 1.1 }}
                style={{
                  border: '1px solid #bbb',
                  outline: '2px solid white',
                  ...(biggerThanMd ? { marginRight: '1rem' } : { display: 'block' })
                }}
                {...screenshotProps(3)}
              />
              <motion.img
                animate={{
                  x: onSecondPage ? 0 : 512
                }}
                transition={{ duration: 0.6 }}
                initial={{ originX: 1 }}
                whileHover={{ scale: 1.1 }}
                style={{
                  border: '1px solid #bbb',
                  outline: '2px solid white',
                  ...(biggerThanMd ? { marginLeft: '1rem' } : { display: 'block' })
                }}
                {...screenshotProps(2)}
              />
            </>
          ) : (
            <>
              <img
                style={{
                  marginTop: '2rem',
                  border: '2px solid white',
                  maxWidth: '80%'
                }}
                {...screenshotProps(3)}
              />
              <img
                style={{
                  marginTop: '2rem',
                  border: '2px solid white',
                  maxHeight: '61.8vh'
                }}
                {...screenshotProps(2)}
              />
            </>
          )}
        </div>
      </Section>
      <Section style={{ padding: '3rem' }}>
        <h1>还有……</h1>
        <p>
          {/* cspell:words Siri Cortana */}
          将课表导入日历以后，Siri, Cortana 这些智能助理也能派上用场啦！更多惊喜，待您发现
          <span role="img" aria-label="开心">
            😋
          </span>
        </p>
        <div ref={thirdPageRef} style={{ paddingTop: '1rem' }}>
          <motion.img
            initial={{ originY: 1 }}
            animate={{
              x: biggerThanMd ? firstImgX : 0,
              y: 128 * thirdPageRatio,
              scale: firstImgScale,
              opacity: transform(thirdPageRatio, [0, 0.2, 0.9, 1], [0, 1, 1, 0])
            }}
            style={{
              ...(biggerThanMd ? { marginRight: '1rem' } : { margin: '0 auto', display: 'block' }),
              maxHeight: '61.8vh'
            }}
            transition={{ duration: 0.2 }}
            {...screenshotProps(7)}
          />
          <motion.img
            animate={{
              x: biggerThanMd ? secondImgX : 0,
              y: 128 * thirdPageRatio,
              scale: secondImgScale,
              opacity: transform(thirdPageRatio, [0, 0.2, 0.9, 1], [0, 1, 1, 0])
            }}
            style={{
              ...(biggerThanMd
                ? { marginLeft: '1rem' }
                : { margin: '4rem auto', display: 'block' }),
              maxHeight: '61.8vh'
            }}
            {...screenshotProps(6)}
          />
        </div>
      </Section>
      <div style={{ height: '8rem', paddingTop: '2rem', textAlign: 'center' }}>
        <h1>开始尝试 ↓</h1>
      </div>
    </div>
  );
}

const scratchScript =
  // eslint-disable-next-line
  'javascript:' + Rules.scratchScript.replace(/^[\s\t]+/g, '').replace(/\n?\r?/g, '');

const { Content } = Layout;

function CodeCopier({ onCopy }: { onCopy?: () => void }) {
  const code = scratchScript;
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  return (
    <Content>
      <div>
        <textarea
          ref={textAreaRef}
          style={{
            resize: 'none',
            color: 'black',
            border: '2px solid gray',
            borderRadius: '8px',
            padding: '4px 16px',
            width: '40%',
            margin: '1rem 0'
          }}
          rows={3}
          value={code}
          onClick={() => {
            textAreaRef.current!.select();
            onCopy!();
          }}
          readOnly
        />
      </div>
      <Tooltip title="已复制" trigger="click">
        <Button
          type="primary"
          shape="round"
          icon={<FontAwesomeIcon icon={faCopy} />}
          onClick={() => {
            copy(code);
            onCopy!();
          }}
        >
          复制
        </Button>
      </Tooltip>
    </Content>
  );
}

function ChildWindowOpener() {
  const hasWindow = Boolean(useAppState((state) => state.window));
  const openChildWindow = useAppState((state) => state.openChildWindow);

  return hasWindow ? null : (
    <div>
      <Button
        onClick={() => {
          openChildWindow(Rules.jwxtUrl);
        }}
      >
        打开教务处官网
      </Button>
    </div>
  );
}

const { Panel } = Collapse;

export function TroubleOnGettingStart() {
  const biggerThanXs = useResponsive().sm;

  return (
    <Collapse
      bordered={false}
      style={{
        margin: biggerThanXs ? '1rem auto' : '1rem 2rem',
        maxWidth: 512
      }}
    >
      <Panel header="遇到问题吗？" key="1">
        已知在某些浏览器可能会把前缀
        <code>javascript:</code>
        去掉，请补上后粘贴
        <br />
        出于安全考虑，禁用 javascript url 的一些浏览器也无法使用
        <br />
        多数手机浏览器和新版 FireFox 有这个问题，换一台设备或一个浏览器就行了。
      </Panel>
    </Collapse>
  );
}

const { Option } = Select;

export function GettingStart() {
  const closeWindow = useAppState((state) => state.closeChildWindow);
  const [selectedCampus, setCampus] = useState<Rules.Campus | undefined>();
  const [enableAlarm, setAlarm] = useState(true);
  const [minutes, setMinutes] = useState(30);
  const [copied, setCopied] = useState(false);
  const [showTeacherName, setTeacherName] = useState(false);

  useEffect(() => {
    if (selectedCampus)
      getAppState().setGenerateOptions({
        alarm: enableAlarm ? minutes : 0,
        teacherInTitle: showTeacherName,
        campus: selectedCampus
      });
  }, [selectedCampus, enableAlarm, minutes, showTeacherName]);

  const isXs = !useResponsive().sm;

  return (
    <Section
      className={Styles.GettingStart}
      style={{ background: '#333', color: 'white', paddingTop: '3rem' }}
      ref={(_) => getAppState().setGettingStartElement(_)}
    >
      <Form
        className={isXs ? Styles.FormInMobile : ''}
        labelCol={{ sm: { offset: 5, span: 5 }, xs: 24 }}
        wrapperCol={{ sm: { offset: 1, span: 6 }, xs: 24 }}
      >
        <Form.Item
          label={
            <Checkbox
              checked={enableAlarm}
              onChange={(event) => {
                setAlarm(event.target.checked);
              }}
            >
              提前提醒我
            </Checkbox>
          }
        >
          <InputNumber
            step={5}
            min={5}
            max={60}
            value={minutes}
            onChange={(_) => {
              setMinutes(_ ?? 30);
            }}
            disabled={!enableAlarm}
            formatter={(value) => `${value} 分钟`}
            style={isXs ? { width: '50%' } : {}}
          />
        </Form.Item>
        <Form.Item label="在课名后面备注教师名字">
          <Switch
            style={showTeacherName ? {} : { boxShadow: '#888 0px 0px 2px 1px' }}
            checked={showTeacherName}
            onChange={(_) => {
              setTeacherName(_);
            }}
          />
        </Form.Item>
        <Form.Item label="你的校区：">
          <Select
            value={selectedCampus}
            style={{ width: isXs ? '50%' : '100%' }}
            onChange={(_) => {
              setCampus(_);
            }}
          >
            <Option value={Rules.Campus.Shipai}>石牌</Option>
            <Option value={Rules.Campus.Daxuecheng}>大学城</Option>
            <Option value={Rules.Campus.Nanhai}>南海</Option>
          </Select>
        </Form.Item>
      </Form>
      {useAppState((state) => state.generateOptions) && (
        <>
          <p style={{ paddingTop: '1rem' }}>复制如下代码</p>
          <CodeCopier
            onCopy={() => {
              setCopied(true);
            }}
          />
          <br />
          <div hidden={!copied}>
            打开教务信息网，登陆后，在地址栏内输入这串代码
            <br />
            （建议使用电脑版的 Chrome 浏览器完成操作）
            <br />
            <ChildWindowOpener />
          </div>
          <TroubleOnGettingStart />
          <div>
            <Button
              onClick={() => {
                closeWindow();
              }}
              size="large"
              shape="round"
            >
              重试
            </Button>
          </div>
          <br />
          <p style={{ padding: '0 2rem' }}>
            我们承诺不会收集教务网其他非课程相关的数据，您教务网的所有数据也不会被后台服务器采集，请放心使用。
          </p>
          <div style={{ height: '3rem' }} />
        </>
      )}
    </Section>
  );
}

export function ScreenPage({
  show,
  children,
  style
}: React.PropsWithChildren<{
  show: boolean;
  style?: CSSProperties;
}>) {
  useBodyScrollLock(show);

  return ReactDOM.createPortal(
    <div hidden={!show}>
      <div className={Styles.ScreenPage} {...{ style }}>
        <Navbar />
        {children}
      </div>
    </div>,
    document.body
  );
}

export function HelpDoc() {
  const [content, setContent] = useState<ContentWithTocNodesSet | undefined>();
  const [error, setError] = useState('');
  const show = useAppState((state) => state.showingHelpDoc);
  const smallerThanMd = !useResponsive().md;

  useAsync(async () => {
    if (show && !content) {
      try {
        setContent(MarkdownParser.convert(await (await fetch(Rules.documentPath)).text()));
      } catch (error) {
        setError(`${error}`);
      }
    }
  }, [show, content]);

  return (
    <ScreenPage {...{ show }}>
      {error ? (
        <Result status="error" title="发生错误" subTitle="你可以把这个问题反馈给我们。">
          {error}
        </Result>
      ) : !content ? (
        <Skeleton />
      ) : smallerThanMd ? (
        <div style={{ overflowY: 'auto', padding: '2rem' }}>
          <nav>
            <h1>目录</h1>
            {content.toc}
          </nav>
          <article className={Styles.Article} style={{ paddingTop: '1rem' }}>
            {content.body}
          </article>
        </div>
      ) : (
        <div className={Styles.HelpDocContainer} style={{ overflowY: 'hidden' }}>
          <nav style={{ overflowY: 'auto' }}>
            <h1>目录</h1>
            {content.toc}
          </nav>
          <article
            className={Styles.Article}
            style={{ overflowY: 'auto', flexGrow: 1, padding: '1rem 2rem 0' }}
          >
            {content.body}
          </article>
        </div>
      )}
    </ScreenPage>
  );
}

export function ResultPage() {
  const progress = useAppState((state) => state.progress);
  const turnToIdle = useAppState((state) => state.turnToIdle);
  const url = useAppState((state) => state.downloadableBlobUrl);

  const isNotIdle = progress !== ProgressState.Idle;
  const isSuccess = progress === ProgressState.Success;
  const isFailure = progress === ProgressState.Failure;

  return (
    <ScreenPage show={isNotIdle}>
      {isSuccess && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className={Styles.Success}
        >
          <FinishCircle />
          <h1>恭喜！你的精品日历已做好</h1>
          <div>
            <a href={url ?? '#'} download="ISCNU匠心营造.ics">
              <Button size="large" style={{ width: 256 }} shape="round">
                下载日历
              </Button>
            </a>
          </div>
          <a
            style={{ lineHeight: 4, color: 'white' }}
            onClick={() => {
              turnToIdle();
            }}
          >
            返回
          </a>
        </motion.div>
      )}
      {isFailure && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className={Styles.Failure}
        >
          <h1>Oops, 出现了故障</h1>
          <button
            onClick={() => {
              turnToIdle();
            }}
          >
            完成
          </button>
        </motion.div>
      )}
    </ScreenPage>
  );
}

export function Footer() {
  return (
    <footer style={{ textAlign: 'center', lineHeight: 2, margin: '2rem 0' }}>
      Copyright © 2008-2020
      <a href="https://i.scnu.edu.cn/about/" target="_about" style={{ padding: '0 0.25rem' }}>
        ISCNU
      </a>
      . All rights Reserved.
      <br />
      华南师范大学网络协会 版权所有
    </footer>
  );
}
