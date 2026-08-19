import Skeleton from "../Skeleton/Skeleton";

const SkeletonListingCard = () => {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-card">
      <Skeleton className="aspect-[4/3] w-full rounded-none" />

      <div className="space-y-3 p-4">
        <Skeleton className="h-5 w-3/4" />

        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    </div>
  );
};

export default SkeletonListingCard;
