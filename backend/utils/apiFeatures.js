class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    // We need to seperate the fields that belongs directly to our data in database from other not related to data fields
    // because on mongoose we implement these two things differently
    // for example [$gt] operator this is related to quering our data by value while [sort,page,limit] it is not related to
    // the values in the database itself , but it ia about arranging it
    // on mongoose we implement these two things differently
    // for example quering the data itself is done by passing query obj into find,findOne,... methods
    // while sorting the data is done by chaining sort method and pass into sorting operator
    const execludedFields = ['page', 'limit', 'sort', 'fields'];
    execludedFields.forEach((el) => delete queryObj[el]);
    // By now our query object only has the data related queries
    // for example if we request `127.0.0.1:3000/api/v1/artworks?size=1824&price[lt]=2000&page=2&limit=3&sort=1`
    // queryObj = queryObj = { size: '1824',price:{lt:'2000'} }
    // note that querystring operators(lt,gt,ne,....) is converted in the req.query to something like `{lt:'2000'}`
    // while mongoose accepts operators like  {$lt:2000} so we have to do two things to this query object
    // first adds the dollar sign to all operators , second converting numeric values into numeric again

    // to add the dollar sign
    //1. convert the query object into string
    let queryStr = JSON.stringify(queryObj);
    //2. apply changes to this string
    queryStr = queryStr.replace(
      /\b(gte|gt|lt|lte|in|nin|ne)\b/g,
      (match) => `$${match}`
    );
    //3. convert it back to object
    const parsedQueryObj = JSON.parse(queryStr);
    // this is now how our query object looks like  { size: '1824',price:{$lt:'2000'} }
    // there is still a problem which is price in database is a numeric value while here it still a string
    // even if mongo do type casting, but we shuold not rely on this, but convert values ourselves
    const numericFields = [
      'width',
      'height',
      'price',
      'avgRating',
      'discount',
      'votes',
    ];
    numericFields.forEach((field) => {
      if (parsedQueryObj[field]) {
        Object.keys(parsedQueryObj[field]).forEach((el) => {
          if (['$gte', '$gt', '$lt', '$lte', '$ne'].includes(el)) {
            parsedQueryObj[field][el] = Number(parsedQueryObj[field][el]);
          }
        });
      }
    });
    // We still need to prepare array fields for example `127.0.0.1:3000/api/v1/artworks?size=1824&categories[in]=oilpainting,charcoal`
    // this will look like in the query.string  { categories: { in: 'oilpainting,charcoal' }}
    // and after adding the $ in the parsedQueryObj { difficulty: { $in: 'easy,medium' }}
    // but this is how mongoose accept this operator {  difficulty:{$in:['easy','medium']}}
    // so we need to convert the value from a coma seperated sting into an array
    const arrayFields = ['categories'];
    arrayFields.forEach((field) => {
      if (
        parsedQueryObj[field]?.$in &&
        typeof parsedQueryObj[field].$in === 'string'
      ) {
        parsedQueryObj[field].$in = parsedQueryObj[field].$in.splite(',');
      }
    });
    // finally we can ass this filters into our query
    this.query = this.query.find(parsedQueryObj);
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      // mongoose sort method accepts either a space seperated string such as query.sort('price -angRating`) minus here means descending
      // it accepts also object such query.sort({ price: 1, avgRating: -1 })  -1 here means descending
      // you can also pass array query.sort([['field1', 'asc'], ['field2', 'desc']])
      // suppose you made a request to 127.0.0.1:3000/api/v1/artworks?sort=price,-avgRating
      // in this case req.query.sort = 'price,-avgRating'
      // we will use easiest way which is space seperated
      let sortBy = [];

      if (Array.isArray(this.queryString.sort)) {
        this.queryString.sort.forEach((s) => {
          if (s.startsWith('-')) {
            sortBy.push([s.slice(1), 'desc']);
          } else {
            sortBy.push([s, 'asc']);
          }
        });

        this.query = this.query.sort(sortBy);
      } else {
        this.query = this.query.sort(this.queryString.sort);
      }
      // if (this.queryString.sort.includes(',')) {
      //   sortBy = this.queryString.sort.join(' ');
      // } else {
      //   sortBy = this.queryString.sort;
      // }
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  //  Limitting Fields in case user dont want all data about each artwork
  limitFields() {
    if (this.queryString.fields) {
      if (Array.isArray(this.queryString.fields)) {
        const fields = this.queryString.fields.join(' ');

        this.query = this.query.select(fields);
      } else {
        this.query = this.query.select(this.queryString.fields);
      }
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  paginate() {
    const page = parseInt(this.queryString.page, 10) || 1;
    const limit = parseInt(this.queryString.limit, 10) || 100;

    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}
module.exports = APIFeatures;
