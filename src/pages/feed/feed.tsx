import { FC, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { fetchFeedsApi, selectFeeds } from '../../services/slices/feedReducer';
import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';

export const Feed: FC = () => {
  const orders: TOrder[] = useSelector<TOrder[]>(selectFeeds);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchFeedsApi());
  }, [dispatch]);

  const handleGetFeeds = useCallback(() => {
    dispatch(fetchFeedsApi());
  }, [dispatch]);

  if (!orders.length) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
