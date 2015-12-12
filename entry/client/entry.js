import 'forum/methods';
import './routes';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

if (process.env.NODE_ENV !== 'production') {
  if (process.env.FRAMEWORK === 'jasmine-client-integration') {
    // Run the integration tests on the mirror
    const context = require.context('../../modules', true, /\/client\/(.*)\/integration\/(.*)\-test\.jsx?$/);
    context.keys().forEach(context);
  } else {
    // Run unit tests on client
    const context = require.context('../../modules', true, /\/client\/(.*)\/unit\/(.*)\-test\.jsx?$/);
    context.keys().forEach(context);
  }
}

