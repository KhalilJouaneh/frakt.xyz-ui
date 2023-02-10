import { FC } from 'react';
import { QuestionCircleOutlined } from '@ant-design/icons';
import classNames from 'classnames/bind';

import { Solana } from '@frakt/icons';
import Tooltip from '@frakt/components/Tooltip';
import { LoadingModal } from '@frakt/components/LoadingModal';

import TokenField from '../../components/TokenField';
import { AppLayout } from '../../components/Layout/AppLayout';
import OrderBook from '../MarketPage/components/OrderBook/OrderBook';
import Button from '../../components/Button';
import SizeField from './components/SizeField/SizeField';
import RadioButton from './components/RadioButton/RadioButton';
import { SliderGradient } from './components/SliderGradient/SliderGradient';
import { Header } from './components/Header';
import { useOfferPage } from './hooks';
import { SOL_TOKEN } from '../../utils';
import styles from './OfferPage.module.scss';

export const OfferPage = () => {
  const {
    loadingModalVisible,
    closeLoadingModal,
    ltv,
    duration,
    offerSize,
    interest,
    onLtvChange,
    onDurationChange,
    onOfferSizeChange,
    onInterestChange,
    onCreateOffer,
    isValid,
    isEdit,
    goBack,
    walletSolBalance,
    market,
    isLoading,
    onEditOffer,
    onRemoveOffer,
  } = useOfferPage();

  return (
    <AppLayout>
      <div className={styles.poolsCreation}>
        <Header
          className={styles.headerWrapper}
          title={isEdit ? 'Offer editing' : 'Offer creation'}
          onBackBtnClick={goBack}
        />

        <div className={styles.block}>
          <div className={styles.floorWrapper}>
            <div className={styles.floorCard}>
              <h6 className={styles.floorCardTitle}>collection</h6>

              <div className={styles.cardCollection}>
                <img
                  className={styles.collectionImage}
                  src={market?.collectionImage}
                  alt={market?.collectionName}
                />
                <span className={styles.floorCardValue}>
                  {!isLoading ? market?.collectionName : '--'}
                </span>
              </div>
            </div>
            <div className={styles.floorCard}>
              <h6 className={styles.floorCardTitle}>floor</h6>
              <span
                className={classNames(styles.floorCardValue, styles.florPrice)}
              >
                {!isLoading
                  ? (market?.oracleFloor.floor / 1e9).toFixed(2) + ' sol'
                  : '--'}
              </span>
            </div>
          </div>
          <h5 className={styles.blockTitle}>Loan parameters</h5>
          <SliderGradient value={ltv} setValue={onLtvChange} />

          <div className={styles.duration}>
            <h6 className={styles.subtitle}>duration</h6>
            <RadioButton
              duration={duration}
              handleDuration={onDurationChange}
              buttons={[{ value: '7' }, { value: '14' }]}
            />
          </div>

          <SizeField
            value={offerSize}
            onValueChange={onOfferSizeChange}
            label="SIZE"
            currentToken={SOL_TOKEN}
            lpBalance={parseFloat((walletSolBalance / 1e9).toFixed(3))}
            toolTipText="Yearly rewards based on the current utilization rate and borrow interest"
          />
          <TokenField
            value={interest}
            onValueChange={onInterestChange}
            label="Interest"
            currentToken={{
              ...SOL_TOKEN,
              symbol: '%',
              logoURI: null,
              name: null,
            }}
            tokensList={[
              { ...SOL_TOKEN, symbol: '%', logoURI: null, name: null },
            ]}
            toolTipText="Yearly rewards based on the current utilization rate and borrow interest"
          />

          <TotalOverview size={offerSize} interest={interest} />
          <div className={styles.btnsWrapper}>
            {isEdit && (
              <>
                <Button
                  onClick={onRemoveOffer}
                  className={classNames(styles.btn, styles.btnDelete)}
                  type="primary"
                >
                  Delete offer
                </Button>
                <Button
                  onClick={onEditOffer}
                  className={styles.btn}
                  type="secondary"
                >
                  Update offer
                </Button>
              </>
            )}
            {!isEdit && (
              <Button
                disabled={!isValid}
                onClick={isEdit ? onEditOffer : onCreateOffer}
                className={styles.btn}
                type="secondary"
              >
                Place offer
              </Button>
            )}
          </div>
        </div>
      </div>
      {!isLoading && !!market && (
        <OrderBook
          market={market}
          hideEditButtons
          syntheticParams={{
            ltv,
            interest: parseFloat(interest) || 0,
            offerSize: parseFloat(interest) * 1e9 || 0,
            durationDays: duration,
          }}
        />
      )}
      <LoadingModal
        title="Please approve transaction"
        visible={loadingModalVisible}
        onCancel={closeLoadingModal}
        // subtitle="In order to create Bond"
      />
    </AppLayout>
  );
};

interface TotalOverviewProps {
  size?: string;
  interest?: string;
}

const TotalOverview: FC<TotalOverviewProps> = ({
  size = '',
  interest = '',
}) => {
  const apr = interest + size; //TODO calc
  const estProfit = parseFloat(interest + size); //TODO calc

  return (
    <div className={styles.total}>
      <h5 className={styles.blockTitle}>Your total is {size} SOL</h5>
      <div className={styles.totalItem}>
        <div className={styles.totalTitle}>
          <span>apr</span>
          <Tooltip
            placement="bottom"
            overlay="Analyzed profit from repaying the loan"
          >
            <QuestionCircleOutlined className={styles.questionIcon} />
          </Tooltip>
        </div>
        <div className={styles.totalValue}>{apr} %</div>
      </div>
      <div className={styles.totalItem}>
        <div className={styles.totalTitle}>
          <span>estimated profit</span>
          <Tooltip
            placement="bottom"
            overlay="Analyzed profit from repaying the loan"
          >
            <QuestionCircleOutlined className={styles.questionIcon} />
          </Tooltip>
        </div>
        <div className={styles.totalValue}>
          {(estProfit / 1e9).toFixed(3)} <Solana />
        </div>
      </div>
    </div>
  );
};
