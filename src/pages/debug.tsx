const DebugPage = () => {
  return (
    <div className="flex justify-center">
      {process.env.VERCEL_URL}
    </div>
  );
};
export default DebugPage;
