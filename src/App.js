import './App.css';
import { ChakraProvider } from '@chakra-ui/react';
import { Main } from './pages';
// import {TestComponent} from "./components/test-component";

function App() {
  return (
      <ChakraProvider>
        <div className="App">
            <Main />
            {/*<TestComponent />*/}
        </div>
      </ChakraProvider>
  );
}

export default App;
