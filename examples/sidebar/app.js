var React = require('react');
var { createRouter, Route, Link } = require('react-router');
var HashHistory = require('react-router/HashHistory');
var data = require('./data');

var Category = React.createClass({
  render () {
    var category = data.lookupCategory(this.props.params.category);
    return (
      <div>
        <h1>{category.name}</h1>
        {this.props.children || (
          <p>{category.description}</p>
        )}
      </div>
    );
  }
});

var CategorySidebar = React.createClass({
  render () {
    var category = data.lookupCategory(this.props.params.category);
    return (
      <div>
        <Link to="/">◀︎ Back</Link>
        <h2>{category.name} Items</h2>
        <ul>
          {category.items.map(item => (
            <li><Link to={`/category/${category.name}/${item.name}`}>{item.name}</Link></li>
          ))}
        </ul>
      </div>
    );
  }
});

var Item = React.createClass({
  render () {
    var { category, item } = this.props.params;
    var menuItem = data.lookupItem(category, item);
    return (
      <div>
        <h1>{menuItem.name}</h1>
        <p>${menuItem.price}</p>
      </div>
    );
  }
});

var Index = React.createClass({
  render: function () {
    return (
      <div>
        <h1>Sidebar</h1>
        <p>
          Routes can have multiple components, so that all portions of your UI
          can participate in the routing.
        </p>
      </div>
    );
  }
});


var IndexSidebar = React.createClass({
  render () {
    return (
      <div>
        <h2>Categories</h2>
        <ul>
          {data.getAll().map(category => (
            <li><Link to={`/category/${category.name}`}>{category.name}</Link></li>
          ))}
        </ul>
      </div>
    );
  }
});

var App = React.createClass({
  render () {
    return (
      <div>
        <div className="Sidebar">
          {this.props.sidebar || <IndexSidebar/>}
        </div>
        <div className="Content">
          {this.props.content || <Index/>}
        </div>
      </div>
    );
  }
});

var routes = (
  <Route path="/" component={App}>
    <Route path="category/:category" components={{content: Category, sidebar: CategorySidebar}}>
      <Route path=":item" component={Item}/>
    </Route>
  </Route>
);

var Router = createRouter(routes);

React.render(<Router history={HashHistory}/>, document.getElementById('example'));

