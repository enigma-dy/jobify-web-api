class QueryBuilder {
  constructor(req) {
    this.req = req;
    this.query = {}; // MongoDB query object
    this.options = {}; // MongoDB options (like limit, skip, sort)
  }

  build() {
    this.setSort();
    this.setPagination();
    this.setFilters();
    this.setFields();
    this.setDateRange();
    this.setSearch();

    return {
      query: this.query,
      options: this.options,
    };
  }

  setSort() {
    const { sort } = this.req.query;
    if (sort) {
      this.options.sort = sort;
    }
  }

  setPagination() {
    const { limit, page } = this.req.query;
    const validatedLimit = parseInt(limit) > 0 ? parseInt(limit) : 10;
    const validatedPage = parseInt(page) > 0 ? parseInt(page) : 1;

    this.options.limit = validatedLimit;
    this.options.skip = (validatedPage - 1) * validatedLimit;
  }

  setFilters() {
    const { filter } = this.req.query;
    if (filter) {
      try {
        const parsedFilter = JSON.parse(filter);
        this.query = { ...this.query, ...parsedFilter };
      } catch (error) {
        console.error("Invalid filter format:", error);
      }
    }
  }

  setFields() {
    const { fields, excludeFields } = this.req.query;
    if (fields) {
      this.options.select = fields.split(",").join(" ");
    } else if (excludeFields) {
      this.options.select = excludeFields
        .split(",")
        .map((field) => `-${field}`)
        .join(" ");
    }
  }

  setDateRange() {
    const { dateFrom, dateTo } = this.req.query;
    const validatedDateFrom = !isNaN(Date.parse(dateFrom))
      ? new Date(dateFrom)
      : null;
    const validatedDateTo = !isNaN(Date.parse(dateTo))
      ? new Date(dateTo)
      : null;

    if (validatedDateFrom || validatedDateTo) {
      this.query.dateRange = {
        ...(validatedDateFrom && { $gte: validatedDateFrom }),
        ...(validatedDateTo && { $lte: validatedDateTo }),
      };
    }
  }

  setSearch() {
    const { search, searchBy } = this.req.query;
    if (search && searchBy) {
      this.query[searchBy] = { $regex: search, $options: "i" };
    }
  }
}

export default QueryBuilder;
