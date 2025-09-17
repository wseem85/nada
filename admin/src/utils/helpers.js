import { users } from '../assets/users';
import { artworks } from '../assets/artworks';
import { reviews } from '../assets/reviews';
import { orders } from '../assets/orders';
const getTopUsersByReviews = (ordersArray) => {
  const userOrderCounts = ordersArray.reduce((acc, order) => {
    const userId = order.user;
    acc[userId] = (acc[userId] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(userOrderCounts)
    .map(([user, count]) => ({ user, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);
};
const getTopUsersByOrders = (reviewsArray) => {
  const userReviewCounts = reviewsArray.reduce((acc, review) => {
    const userId = review.user;
    acc[userId] = (acc[userId] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(userReviewCounts)
    .map(([user, count]) => ({ user, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);
};

export const calculateData = () => {
  const totalArtworks = artworks.length;
  const totalusers = users.length;
  const totalReviews = reviews.length;
  const totalOrders = orders.length;

  const soldedArtworks = artworks.filter((el) => !el.available && el).length;
  const inStoreArtworks = artworks.filter((el) => el.available && el).length;
  const onSaleArtworks = artworks.filter((el) => el.discount && el).length;

  const deliveredOrders = orders.filter(
    (el) => el.status === 'delivered' && el
  ).length;
  const paidOrders = orders.filter((el) => el.status === 'paid' && el).length;
  const unPaidOrders = orders.filter(
    (el) => el.status === 'unPaid' && el
  ).length;

  const topFansIds = getTopUsersByReviews(reviews);
  const topFans = topFansIds.map((el) => {
    const user = users.filter((user) => user._id === el.user)[0];
    return user;
  });
  const topCustomersIds = getTopUsersByOrders(orders);
  const topCustomers = topCustomersIds.map((el) => {
    const user = users.filter((user) => user._id === el.user)[0];
    return user;
  });

  const fiveStarReviews = reviews.filter((el) => el.rating === 5).length;
  const fourStarReviews = reviews.filter((el) => el.rating === 4).length;
  const threeStarReviews = reviews.filter((el) => el.rating === 3).length;

  return {
    artworks: {
      totalArtworks,
      inStoreArtworks,
      soldedArtworks,
      onSaleArtworks,
    },
    orders: {
      totalOrders,
      paidOrders,
      deliveredOrders,
      unPaidOrders,
    },
    users: {
      totalusers,
      topFans,
      topCustomers,
    },
    reviews: {
      totalReviews,
      fiveStarReviews,
      fourStarReviews,
      threeStarReviews,
    },
  };
};
