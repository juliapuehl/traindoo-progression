import DoneIcon from '@mui/icons-material/Done';
import {Box, Card, CardContent, CardMedia, Typography} from '@mui/material';
import moment from 'moment';
import {CSSProperties} from 'react';
import {useSelector} from 'react-redux';
import {getUserId} from '../../logic/firestore';
import {
  dark_gray,
  primary_green,
  ultra_light_gray,
  white,
} from '../../styles/colors';

export enum MessageContentType {
  textOnly,
  audio,
  img,
  video,
  screenRecording,
  document,
}

type Props = {
  contentText?: string;
  contentMedia?: string;
  sentAt: string;
  sentBy: string;
  type: MessageContentType;
  style?: CSSProperties;
};

export const ChatMessage = (props: Props) => {
  // temporary flag, later to be implemented in chat settings
  const showCheckmarks = false;
  const userId = useSelector(getUserId);
  const messageDate = moment(props.sentAt).format('Do MMM LT');

  const renderContent = (
    type: MessageContentType,
    contentText: string,
    contentMedia: string,
  ) => {
    switch (type) {
      case MessageContentType.textOnly:
        return (
          <CardContent style={styles.contentStyle}>
            <span>{contentText}</span>
          </CardContent>
        );
      case MessageContentType.img:
        return (
          <>
            <CardMedia component="img" image={contentMedia} />
            <CardContent style={styles.contentStyle}>
              <span>{contentText}</span>
            </CardContent>
          </>
        );
      case MessageContentType.video:
        return (
          <>
            <CardMedia component="video" image={contentMedia} autoPlay />
            <CardContent style={styles.contentStyle}>
              <span>{contentText}</span>
            </CardContent>
          </>
        );
      default:
        return <Box sx={styles.messageBox}>{contentText}</Box>;
    }
  };

  const renderCard = (
    zipferlStyle: CSSProperties,
    cardStyle: CSSProperties,
    left: boolean,
  ) => {
    return left ? (
      <>
        <div style={zipferlStyle}></div>
        <Card sx={cardStyle}>
          {renderContent(props.type, props.contentText, props.contentMedia)}
          <div style={styles.messageSubtitle}>
            {showCheckmarks ? (
              <DoneIcon style={styles.messageSeenCheckMarks} />
            ) : (
              <></>
            )}
            <Typography variant="body2" color={ultra_light_gray}>
              {moment(props.sentAt).format('Do MMM LT')}
            </Typography>
          </div>
        </Card>
      </>
    ) : (
      <>
        <Card sx={cardStyle}>
          {renderContent(props.type, props.contentText, props.contentMedia)}
          <div style={styles.messageSubtitle}>
            {showCheckmarks ? (
              <DoneIcon style={styles.messageSeenCheckMarks} />
            ) : (
              <></>
            )}
            <Typography variant="body2" color={ultra_light_gray}>
              {messageDate}
            </Typography>
          </div>
        </Card>
        <div style={zipferlStyle}></div>
      </>
    );
  };

  return (
    <div style={styles.messageBox}>
      {props.sentBy === userId
        ? renderCard(styles.messageZipferlRechts, styles.cardStyleRechts, false)
        : renderCard(styles.messageZipferlLinks, styles.cardStyleLinks, true)}
    </div>
  );
};

type Styles = {
  messageBox: CSSProperties;
  cardStyleLinks: CSSProperties;
  cardStyleRechts: CSSProperties;
  contentStyle: CSSProperties;
  messageZipferlLinks: CSSProperties;
  messageZipferlRechts: CSSProperties;
  messageSubtitle: CSSProperties;
  messageSeenCheckMarks: CSSProperties;
};

const styles: Styles = {
  messageBox: {
    display: 'flex',
    maxWidth: '70%',
  },
  cardStyleLinks: {
    backgroundColor: dark_gray,
    color: white,
    padding: 2,
    borderRadius: '0px 15px 15px 15px',
  },
  cardStyleRechts: {
    backgroundColor: dark_gray,
    color: white,
    padding: 2,
    borderRadius: '15px 0 15px 15px',
  },
  contentStyle: {
    paddingBottom: 0,
    padding: 0,
  },
  messageZipferlLinks: {
    width: 0,
    height: 0,
    borderRight: '10px solid #434343',
    borderBottom: '20px solid transparent',
  },
  messageZipferlRechts: {
    width: 0,
    height: 0,
    borderLeft: '10px solid #434343',
    borderBottom: '20px solid transparent',
  },
  messageSeenCheckMarks: {
    width: 20,
    height: 20,
    color: primary_green,
  },
  messageSubtitle: {
    display: 'flex',
    justifyContent: 'right',
  },
};
