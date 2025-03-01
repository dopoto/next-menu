export const PostPayment = ({ stripeSession }: { stripeSession: any }) => {
  return <div>{JSON.stringify(stripeSession)}</div>;
};
