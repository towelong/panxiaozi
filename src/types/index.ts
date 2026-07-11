export interface PageResult<T> {
  list: T[];
  total: number;
}

export interface HomeMovie {
  id: number;
  title: string;
  poster: string;
  rating: number;
  year: number;
  type: string;
}
