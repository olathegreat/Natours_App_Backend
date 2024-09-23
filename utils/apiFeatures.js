class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    //  1a Filtering
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];

    excludedFields.forEach((el) => delete queryObj[el]);

    // 1b Advanced filtering

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query.find(JSON.parse(queryStr));

    return this;

    // let query = Tour.find(JSON.parse(queryStr));
  }

  sort() {
    // 2 sorting
    // if(req.query.sort){
    //   query = query.sort(req.query.sort)
    // } for sorting with just one field but for multiple fields go to the next line

    if (this.queryString.sort) {
      const sortBy = this.queryString.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      // to return all fields minus _v
      this.query = this.query.select('-_v');
    }
    return this;
  }
  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    //  to return error for pages that are not there

    // if(this.queryString.page) {
    //   const numTours = await Tour.countDocuments();
    //   if(skip>=numTours) throw new Error('This page doesnot exist')
    // }
    return this;
  }
}


module.exports = APIFeatures