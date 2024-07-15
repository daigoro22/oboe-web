import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type * as React from "react";

type Header = {
  key: string;
  className?: string;
  content: React.ReactNode;
};

export type ListProps<Headers extends Header[]> = {
  headers?: Headers;
  rows: {
    key: string;
    className?: string;
    cells: { [K in keyof Headers]: { key: string; content: React.ReactNode } };
  }[];
};

export const List = <Headers extends Header[]>({
  headers,
  rows,
}: ListProps<Headers>) => {
  return (
    <Table>
      {headers && (
        <TableHeader>
          <TableRow>
            {headers.map(({ className, content, key }) => (
              <TableHead key={key} className={className}>
                {content}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
      )}
      <TableBody>
        {rows.map(({ className, cells, key }) => (
          <TableRow key={key} className={className}>
            {cells.map(({ content, key }) => (
              <TableCell key={key}>{content}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
