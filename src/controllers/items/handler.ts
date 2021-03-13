// module.exports.list = handler.list.bind(handler);
// const list: Handler = (event: any, context: Context) => handler.list(event, context);
// export { list };
import { ItemsController } from './ItemsController';

module.exports = new ItemsController();
