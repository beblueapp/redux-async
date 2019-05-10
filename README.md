# Redux Async

> Controls async dispatches on a standardized manner

## Motivation

> There are only two hard things in Computer Science: cache invalidation and
> naming things.
>
> -- Phil Karlton

When dealing with asynchronous actions we need to keep track of its progress, we need
to know if it's *LOADING|PENDING|WAITING*, or whether it has *COMPLETED|FULFILLED|ENDED*
or *FAILED|REJECTED*. If choosing names weren't hard enough, we still need to keep
it aligned throughout the application. By using a helper, we could use a single
mechanism for handling asynchronous actions with tracking of loading and more.

## Install

As this is supposed to be used on top of `redux` with `redux-thunk` as middleware,
you first need to install both as specified in our `peerDependencies`

```bash
npx install-peerdeps @beblueapp/redux-async
npm install @beblueapp/redux-async
```

## Usage

There're two main components on `redux`, actions and reducers, for both, we've provided
helpers, the first will wrap your action and do the dynamic dispatches, and the second
will receive that set of actions and control the state accordingly.

### Action

Given there're many types of asynchronous actions, and sometimes you may just want
to wrap a simple function, we enable you to wrap whatever function that returns a
promise or not, we'll handle each type of function based on its returned type. The
creator will promissify the function result and dispatch actions according to promise's
states, below you can see an action creator which will dispatch actions of name
`'FETCH_CUSTOMERS'` containing the result of `index` from customers gateway.

```javascript
// Actions
import { createAC } from '@beblueapp/redux-async'
import { index } from 'gateways/customers'

export const fetchCustomers = createAC('FETCH_CUSTOMERS', index)

// Component
const Customers = ({ type, customers, fetchCustomers }) => {
    useEffect(() => {
        fetchCustomers(type)
            .catch(({ response }) => console.log('An error has occured', response.data))
    }, [type])


    return (customers.error
     ? <div>Something bad happened: {customers.data.response.statusText}</div>
     : <ul>
        {customers.data.map(c => <li key={c.id}>{c.name}</li>)}
    </ul>)
}
```

### Reducer

As any reducer on any redux powered application, it'll just capture the async actions
and change the state accordingly. The default behavior for the async reducer is to
control every possible combination and return all the state, however, sometimes we
want just some piece of data, this can be controlled by a second parameter that'll
pick only the relevant data to you. Below you can see a reducer which will handle
actions of name `'FETCH_CUSTOMERS'` under the `customers` property of our state.

```javascript
// Reducer
import { createR } from '@beblueapp/redux-async'

export combineReducers({
    customers: createR('FETCH_CUSTOMERS')
})
```

## Credits

This was inspired by
[some](https://blog.logrocket.com/managing-asynchronous-actions-in-redux-1bc7d28a00c6)
[articles](https://medium.com/skyshidigital/simplify-redux-request-success-failure-pattern-ce77340eae06)
about handling asynchronous actions without using `redux-thunk`. I've headed a
different direction because I think it's better to leverage a tested library and
standardize things that it doesn't control. Besides those articles the main inspiration
was the lack of standard control over asynchronous actions on the applications I've worked on.

## LICENSE

MIT © [Beblue](https://beblue.com.br)
