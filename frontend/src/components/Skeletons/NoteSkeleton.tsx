import Skeleton from '../Skeleton';

const NoteSkeleton = ({ size = 1 }: { size?: number }) => {
  return (
    <>
      {Array.from({ length: size }, (_, index) => (
        <div key={index} className={`cursor-pointer p-5 rounded-3xl shadow mb-2 h-44 flex flex-col bg-gray-50 gap-4`}>
          <Skeleton width="50%" height="1.3rem" />
          <Skeleton width="70%" height="0.8rem" />
          <Skeleton width="100%" height="1rem" />
          <div className="flex justify-between mt-auto">
            <Skeleton width="10%" height="0.8rem" />
            <Skeleton width="20%" height="0.8rem" />
          </div>
        </div>
      ))}
    </>
  );
};

export default NoteSkeleton;
