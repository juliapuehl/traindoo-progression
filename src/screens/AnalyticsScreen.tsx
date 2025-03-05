import {CircularProgress} from '@mui/material';
import firebase from 'firebase/app';
import {t} from 'i18n-js';
import _ from 'lodash';
import {CSSProperties, useRef} from 'react';
import {Responsive, WidthProvider} from 'react-grid-layout';
import {useDispatch, useSelector} from 'react-redux';
import {useFirestore} from 'react-redux-firebase';
import ImageViewer from 'react-simple-image-viewer';
import {withSize} from 'react-sizeme';
import {useCurrentWidth} from 'react-socks';
import DashboardAddButton from '../components/DashboardAddButton';
import {DashboardImageComponent} from '../components/DashboardImageComponent';
import {DashboardTextComponent} from '../components/DashboardTextComponent';
import {DashboardValuesGraph} from '../components/DashboardValuesGraph';
import {DashboardValuesTable} from '../components/DashboardValuesTable';
import {
  getDailyDashboardElements,
  getDailyDashboardLayout,
  getUserId,
  webSettingsLayoutQuery,
} from '../logic/firestore';
import {getCurrentAthleteId} from '../store/athleteSlice';
import {
  getImageViewerData,
  resetImageViewerPaths,
} from '../store/trainingSlice';
import {primary_green} from '../styles/colors';
import {DailyCheckDashboardElementType} from '../types/DashboardLayout';

const AnalyticsScreenComponent = () => {
  const elementArray = useSelector(getDailyDashboardElements);
  const firestoreLayout = useSelector(getDailyDashboardLayout);
  const width = useCurrentWidth();
  const firestore = useFirestore();
  const userId = useSelector(getUserId);
  const dispatch = useDispatch();
  const imageViewData = useSelector(getImageViewerData);
  const athleteId = useSelector(getCurrentAthleteId);

  const blockUpdate = useRef(false);

  const closeImageViewer = () => {
    dispatch(resetImageViewerPaths());
  };

  Intercom('update', {
    vertical_padding: 20,
  });

  // const dailyLayout = useSelector(getDailyLayout);
  const ResponsiveGridLayout = WidthProvider(Responsive);
  const elementsPath = 'dailyCheckLayout.elements.';
  const layoutPath = 'dailyCheckLayout.layout';
  const removeElement = (elementKey: string) => {
    const changeObject: any = {
      [elementsPath + elementKey]: firebase.firestore.FieldValue.delete(),
    };
    const deletedElementIndex = elementArray[elementKey].index;

    Object.values(elementArray)
      .filter((element) => element.index > deletedElementIndex)
      .forEach(
        (element) =>
          (changeObject[elementsPath + element.elementKey] = {
            ...element,
            index: element.index - 1,
          }),
      );

    firestore.update(webSettingsLayoutQuery(userId), changeObject);
  };
  const safeLayoutToFirestore = async (newLayout: any) => {
    const removeEmpty = (obj) => {
      Object.keys(obj).forEach((key) =>
        obj[key] === undefined ? delete obj[key] : {},
      );
      return obj;
    };
    const changeObject = {};
    if (newLayout) {
      for (const key of Object.keys(newLayout)) {
        changeObject[key] = newLayout[key].map((element) =>
          removeEmpty(element),
        );
      }
      await firestore.set(
        webSettingsLayoutQuery(userId),
        {
          dailyCheckLayout: {layout: newLayout},
        },
        {merge: true},
      );
    }
  };
  const onLayoutChange = async (oldlayout, allLayouts) => {
    if (blockUpdate.current) {
      return;
    } else {
      blockUpdate.current = true;
      setTimeout(() => {
        blockUpdate.current = false;
      }, 500);
    }
    const layoutsEqual = (objOne, objTwo) => {
      for (const key in objOne) {
        if (objTwo && objTwo[key]) {
          const arrayOne = _.sortBy(objOne[key], (element) => {
            return element.i;
          });
          const arrayTwo = _.sortBy(objTwo[key], (element) => {
            return element.i;
          });
          let index = 0;
          for (const arrElement of arrayOne) {
            for (const arrKey in arrElement) {
              if (
                (arrayTwo[index]?.[arrKey] === undefined &&
                  arrElement[arrKey] !== undefined) ||
                arrElement[arrKey] !== arrayTwo[index][arrKey]
              ) {
                return false;
              }
            }
            index += 1;
          }
        } else {
          return false;
        }
      }
      return true;
    };
    if (!layoutsEqual(allLayouts, firestoreLayout)) {
      await safeLayoutToFirestore(allLayouts);
    }
  };
  const setElementStatic = (elementKey: string, value: boolean) => {
    const newLayout = {};
    for (const key of Object.keys(firestoreLayout)) {
      newLayout[key] = firestoreLayout[key].map((element) => {
        if (element.i === elementKey) {
          return {...element, static: value};
        } else {
          return element;
        }
      });
    }
    firestore.update(webSettingsLayoutQuery(userId), {
      [layoutPath]: newLayout,
      [elementsPath + elementKey + '.editable']: value,
    });
  };
  const children = () => {
    return Object.values(elementArray)?.map(
      (element: DailyCheckDashboardElementType) => {
        const dataGrid = {
          x: 0,
          y: 0,
          w: element.minW,
          h: element.minH,
          minH: element.minH,
          minW: element.minW,
        };
        if (element.type === 'graph') {
          return (
            <div key={element.elementKey} data-grid={dataGrid}>
              <DashboardValuesGraph
                element={element}
                setElementStatic={setElementStatic}
                remove={() => {
                  removeElement(element.elementKey);
                }}
              />
            </div>
          );
        } else if (element.type === 'table') {
          return (
            <div key={element.elementKey} data-grid={dataGrid}>
              <DashboardValuesTable
                element={element}
                setElementStatic={setElementStatic}
                remove={() => {
                  removeElement(element.elementKey);
                }}
              />
            </div>
          );
        } else if (element.type === 'text') {
          return (
            <div key={element.elementKey} data-grid={dataGrid}>
              <DashboardTextComponent
                element={element}
                remove={() => {
                  removeElement(element.elementKey);
                }}
                setElementStatic={setElementStatic}
              />
            </div>
          );
        } else if (element.type === 'media') {
          return (
            <div key={element.elementKey} data-grid={dataGrid}>
              <DashboardImageComponent
                element={element}
                remove={() => {
                  removeElement(element.elementKey);
                }}
                setElementStatic={setElementStatic}
              />
            </div>
          );
        } else {
          return <></>;
        }
      },
    );
  };
  if (!athleteId) {
    return <div style={styles.warning}>{t('NAVIGATION_NO_ATHLETE')}</div>;
  } else {
    return (
      <div style={styles.main}>
        <div>
          {firestoreLayout && Object.keys(firestoreLayout).length > 0 ? (
            <ResponsiveGridLayout
              className="layout"
              isDraggable
              isRearrangeable
              layouts={firestoreLayout}
              isResizable
              rowHeight={64}
              width={width}
              onLayoutChange={onLayoutChange}
              breakpoints={{
                l: 1600,
                lg: 1200,
                md: 996,
                sm: 768,
                xs: 480,
                xxs: 0,
              }}
              cols={{l: 20, lg: 12, md: 10, sm: 6, xs: 4, xxs: 2}}
            >
              {children()}
            </ResponsiveGridLayout>
          ) : (
            <div style={styles.loading}>
              <CircularProgress sx={{margin: 2}} color={'info'} size={80} />
            </div>
          )}
          {imageViewData && (
            <ImageViewer
              backgroundStyle={styles.imageViewer}
              src={imageViewData.images}
              currentIndex={imageViewData.selectedIndex}
              disableScroll={false}
              closeOnClickOutside={true}
              onClose={closeImageViewer}
            />
          )}
        </div>
        <div style={styles.addButton}>
          <DashboardAddButton />
        </div>
      </div>
    );
  }
};

type Styles = {
  main: CSSProperties;
  contentContainer: CSSProperties;
  addButton: CSSProperties;
  icon: CSSProperties;
  imageViewer: CSSProperties;
  warning: CSSProperties;
  loading: CSSProperties;
};

const styles: Styles = {
  contentContainer: {},
  main: {
    backgroundColor: 'background_color_dark',
    paddingBottom: 200,
  },
  addButton: {
    position: 'fixed',
    right: 20,
    bottom: 78,
  },
  icon: {backgroundColor: 'white'},
  imageViewer: {zIndex: 10000},
  warning: {
    paddingLeft: 8,
    paddingBottom: 8,
    paddingTop: 20,
    height: 24,
    color: primary_green,
  },
  loading: {
    display: 'flex',
    flex: 1,
    height: '95vH',
    justifyContent: 'center',
    alignItems: 'center',
  },
};

export const AnalyticsScreen = withSize({
  refreshMode: 'debounce',
  refreshRate: 60,
})(AnalyticsScreenComponent);
