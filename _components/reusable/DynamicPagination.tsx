'use client'

import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
} from "@/components/ui/pagination"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import LeftArrowIcon from "../icons/common/LeftArrowIcon";
import RightArrowIcon from "../icons/common/RightArrowIcon";

interface TransportPaginationProps {
    // Your existing props
    currentPage: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    onPageChange: (page: number) => void;
    show?: boolean;
    totalItems?: number;
    itemsPerPage?: number;
    
    // New props for items per page functionality
    onItemsPerPageChange?: (itemsPerPage: number) => void;
    itemsPerPageOptions?: number[];
    showItemsPerPage?: boolean;
}

export default function DynamicPagination({
    // Your existing props
    currentPage,
    totalPages,
    hasNextPage,
    hasPrevPage,
    onPageChange,
    show = true,
    totalItems = 0,
    itemsPerPage = 10, // Default to 10
    
    // New props for items per page
    onItemsPerPageChange,
    itemsPerPageOptions = [5, 10, 15, 20, 25, 30, 50], // Default values as requested
    showItemsPerPage = false,
}: TransportPaginationProps) {

    // Your existing handlers
    const handlePrevious = () => {
        if (hasPrevPage) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (hasNextPage) {
            onPageChange(currentPage + 1);
        }
    };

    const handlePageClick = (page: number) => {
        onPageChange(page);
    };

    // New handler for items per page
    const handleItemsPerPageChange = (value: string) => {
        const newItemsPerPage = parseInt(value);
        onItemsPerPageChange?.(newItemsPerPage);
        // Reset to first page when changing items per page
        onPageChange(1);
    };

    // Calculate showing range
    const getShowingRange = () => {
        if (!totalItems) return { start: 0, end: 0 };
        
        const start = ((currentPage - 1) * itemsPerPage) + 1;
        const end = Math.min(currentPage * itemsPerPage, totalItems);
        
        return { start, end };
    };

    // Your existing page number generation (unchanged)
    const getPageNumbers = () => {
        const pages: number[] = [];
        const maxVisiblePages = 3;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            let startPage = Math.max(1, currentPage - 1);
            let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

            if (endPage - startPage + 1 < maxVisiblePages) startPage = endPage - maxVisiblePages + 1;

            for (let i = startPage; i <= endPage; i++) pages.push(i);
        }

        return pages;
    };

    if (!show) return null;

    const { start, end } = getShowingRange();

    return (
        <div className="flex flex-col-reverse sm:flex-row justify-between py-3 text-[#5D5D5D] text-sm leading-[21px] rounded-b-lg select-none">
            
            {/* Your existing pagination */}
            <div className="select-none">
                <Pagination>
                    <PaginationContent>

                        {/* Previous Button */}
                        <PaginationItem className="mr-5">
                            <div
                                onClick={handlePrevious}
                                className={`w-full h-[35px] flex items-center py-2.5 px-3 cursor-pointer rounded-md border border-[#F1F2F4] ${!hasPrevPage ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                             <RightArrowIcon/> 
                            </div>
                        </PaginationItem>

                        {/* Page Numbers */}
                        {getPageNumbers().map((page) => (
                            <PaginationItem key={page}>
                                <PaginationLink
                                    href="#"
                                    isActive={page === currentPage}
                                    className={`${page === currentPage ? 'bg-[#323B49] text-white' : 'bg-transparent text-graytext'}  border-0`}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handlePageClick(page);
                                    }}
                                >
                                    {page}
                                </PaginationLink>
                            </PaginationItem>
                        ))}

                        {/* Ellipsis for long pages */}
                        {totalPages > 5 && currentPage < totalPages - 1 && (
                            <PaginationItem>
                                <PaginationEllipsis />
                            </PaginationItem>
                        )}

                        {/* Last Page */}
                        {totalPages > 3 && currentPage < totalPages - 1 && (
                            <PaginationItem>
                                <PaginationLink
                                    href="#"
                                    isActive={totalPages === currentPage}
                                    className={`${totalPages === currentPage ? 'bg-[#F8F8F8]' : 'bg-transparent'} text-graytext border-0`}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handlePageClick(totalPages);
                                    }}
                                >
                                    {totalPages}
                                </PaginationLink>
                            </PaginationItem>
                        )}

                        {/* Next Button */}
                        <PaginationItem className="ml-5">
                            <div
                                onClick={handleNext}
                                className={`w-full h-[35px] flex items-center py-2.5 px-3 cursor-pointer rounded-md border border-[#F1F2F4] ${!hasNextPage ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                  <LeftArrowIcon/>
                            </div>
                        </PaginationItem>

                    </PaginationContent>
                </Pagination>
            </div>

            {/* Fixed Items Per Page with "Showing X to Y of Z entries" */}
            {showItemsPerPage && onItemsPerPageChange && (
                <div className="flex items-center gap-2 mb-4 sm:mb-0">
                    <span className="text-xs text-[#687588] font-bold">
                        Showing {start} to {end} of {totalItems} entries
                    </span>
                    <Select 
                        value={itemsPerPage.toString()} 
                        onValueChange={handleItemsPerPageChange}
                    >
                        <SelectTrigger className="w-20 h-9 border border-[#323B49] text-white">
                            <SelectValue placeholder={itemsPerPage.toString()} />
                        </SelectTrigger>
                        <SelectContent>
                            {itemsPerPageOptions.map(option => (
                                <SelectItem 
                                    key={option} 
                                    value={option.toString()}
                                >
                                    {option}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            )}
        </div>
    );
}
