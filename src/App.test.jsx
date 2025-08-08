import { render } from '@testing-library/react'
import { Provider } from 'react-redux'
import store from './store/store'
import App from './App'

describe('App', () => {
  it('renders the App component', () => {
    render(
        <Provider store={store}>
            <App />
        </Provider>
    )  
  })
})