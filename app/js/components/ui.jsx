var $ = require('jquery')
var React = require('react')
var Router = require('../router')
var ReposService = require('../stores/repositories')
var UsersService = require('../stores/users')

var Api = require('../api')

var ExtImageLoader = {
  componentDidUpdate: function () {
    $(React.findDOMNode(this)).find('img').each(function () {
      Api.loadImage($(this).attr('data-src'), this)
    })
  },
  componentDidMount: function () {
    $(React.findDOMNode(this)).find('img').each(function () {
      Api.loadImage($(this).attr('data-src'), this)
    })
  }
}

var Header = React.createClass({
  render: function () {
    return (
      <header className="bar bar-nav">
        <a href="#" className={"icon icon-left-nav pull-left" +(this.props.back === "true" ? "" : " hidden")}> </a>

        <h1 className="title"> {this.props.text} </h1>
      </header>
    )
  }
})

var SearchBar = React.createClass({
  searchHandler: function () {
    this.props.searchHandler(this.refs.searchKey.getDOMNode().value);
  },
  render: function () {
    return (
      <div className="bar bar-standard bar-header-secondary">
        <input type="search" ref="searchKey" onChange={this.searchHandler} value={this.props.searchKey}/>
      </div>
    )
  }
})

var RepoListItem = React.createClass({
  mixins: [ExtImageLoader],
  render: function () {
    return (
      <li className="table-view-cell media">
        <a href={"#repos/" +this.props.repo.id}>
          <img className="media-object small pull-left"
               data-src={this.props.repo.owner.avatar_url}/>
          {this.props.repo.name}
        </a>
      </li>
    )
  }
})

var RepoList = React.createClass({
  render: function () {
    var items = this.props.repos.map(function (repo) {
      return (
        <RepoListItem key={repo.id} repo={repo}/>
      )
    })
    return (
      <ul className="table-view">
        {items}
      </ul>
    )
  }
})

var RepoListPage = React.createClass({
  render: function () {
    return (
      <div>
        <Header text="repo Directory"
                back="true"/>
        <SearchBar searchKey={this.props.searchKey}
                   searchHandler={this.props.searchHandler}/>

        <div className="content">
          <RepoList repos={this.props.repos}/>
        </div>
      </div>
    )
  }
})

var UserListPage = React.createClass({
  render: function () {
    return (
      <div>
        <Header text="Github users"
                back="false"/>
        <SearchBar searchKey={this.props.searchKey} searchHandler={this.props.searchHandler}/>

        <div className="content">
          <UserList users={this.props.users}/>
        </div>
      </div>
    )
  }
})

var UserList = React.createClass({
  render: function () {
    var items = this.props.users.map(function (user) {
      return (
        <UserListItem key={user.id} user={user}/>
      )
    })
    return (
      <ul className="table-view">
        {items}
      </ul>
    )
  }
})

var UserListItem = React.createClass({
  mixins: [ExtImageLoader],
  render: function () {
    return (
      <li className="table-view-cell media">
        <a href={"#users/" +this.props.user.login}>
          <img className="media-object small pull-left"
               data-src={this.props.user.avatar_url}/>
          {this.props.user.login}
        </a>
      </li>
    )
  }
})

var RepoPage = React.createClass({
  mixins: [ExtImageLoader],
  render: function () {
    return (
      <div>
        <Header text="repo" back="true"/>

        <div className="card">
          <ul className="table-view">
            <li className="table-view-cell media">
              <img className="media-object big pull-left"
                   data-src={this.props.repo.owner.avatar_url}/>

              <h1> {this.props.repo.name}</h1>

              <p> {this.props.repo.full_name}</p>
            </li>
            <li classname="table-view-cell media">
              <a href={this.props.repo.html_url} className="push-right">
                <span classname="media-object pull-left icon icon-call"> </span>

                <div classname="media-body">
                  Repo URL
                  <p> {this.props.repo.officePhone}</p>
                </div>
              </a>
            </li>
            <li classname="table-view-cell media">
              <a href={this.props.repo.owner.url} className="push-right">
                <span classname="media-object pull-left icon icon-call"> </span>

                <div classname="media-body">
                  Owner URL
                  <p> {this.props.repo.officePhone}</p>
                </div>
              </a>
            </li>


          </ul>
        </div>
      </div>
    )
  }
})

var Main = React.createClass({
  getInitialState: function () {
    return {
      repoSearchKey: '',
      repos: [],
      userSearchKey: '',
      users: [],
      lastUserId: null,
      page: null
    }
  },
  userSearchHandler: function (key) {
    UsersService.findByLogin(key).then(function (users) {
        this.setState({
          userSearchKey: key,
          users: users,
          page: <UserListPage searchKey={key} searchHandler={this.userSearchHandler} users={users}/>
        })
      }.bind(this)
    )
  },
  repoSearchHandler: function (login, key) {
    ReposService.findByName(login, key).then(function (repos) {
        this.setState({
          repoSearchKey: key,
          repos: repos,
          page: <RepoListPage searchKey={key}
                              searchHandler={this.repoSearchHandler.bind(null, login)}
                              repos={repos}
                              login={login}
            />
        })
      }.bind(this)
    )
  },
  componentDidMount: function () {
    var that = this
    Router.addRoute('', function () {
      that.setState({
        page: <UserListPage searchKey={that.state.userSearchKey}
                            searchHandler={that.userSearchHandler}
                            users={that.state.users}/>
      })
    })

    Router.addRoute('users/:id', function (id) {
      if (id != that.state.lastUserId) {
        ReposService.initRepos(id).then(function (repos) {
          that.setState({
            lastUserId: id,
            page: <RepoListPage searchKey={that.state.repoSearchKey}
                                searchHandler={that.repoSearchHandler.bind(that, id)}
                                repos={repos} login={id}
              />
          })
        })
      } else {
        that.setState({
          page: <RepoListPage searchKey={that.state.repoSearchKey}
                              searchHandler={that.repoSearchHandler.bind(that, id)}
                              repos={that.state.repos} login={id}
            />
        })
      }
    })

    Router.addRoute('repos/:repoId', function (repoId) {
      ReposService.findById(that.state.lastUserId, repoId)
        .then(function (repo) {
          that.setState({
            page: <RepoPage repo={repo}/>
          })
        })
    })

    Router.start()
  },
  render: function () {
    return this.state.page;
  }
})


var Ui = {}

var MainUI = <Main />

Ui.init = function () {
  React.render(MainUI, document.body)
}

module.exports = Ui
