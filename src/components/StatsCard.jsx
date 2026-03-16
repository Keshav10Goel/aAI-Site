
const StatsCard = ({title,value}) => {

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 text-center w-48">

      <h4 className="text-gray-500 text-sm">
        {title}
      </h4>

      <p className="text-2xl font-bold mt-2">
        {value}
      </p>

    </div>
  );

};

export default StatsCard;
