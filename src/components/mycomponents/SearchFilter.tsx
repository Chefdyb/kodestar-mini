import { CaretSortIcon } from "@radix-ui/react-icons";
import { Button } from "../ui/button";

const SearchFilter = ({ searchTerm, setSearchTerm }: any) => {
  return (
    <div className="flex justify-between items-center py-4 gap-2">
      <input
        type="text"
        className=" p-2 w-full bg-transparent br rounded-full bg-white bg-opacity-10 border border-opacity-10 border-white focus:border-opacity-60 focus:outline-none text-white font-mono font-bold px-5"
        placeholder="Search projects..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
        }}
      />
      <Button
        variant={"ghost"}
        className="hover:text-gray-900 text-gray-100 rounded-full aspect-square p-0"
      >
        <CaretSortIcon className=" h-6 w-6  " />
      </Button>
    </div>
  );
};

export default SearchFilter;
