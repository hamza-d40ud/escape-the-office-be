import cron from 'node-cron';

const main_logic = async () => {
};

export const main_logic_scheduler = () => {
  // every 4 minutes
  cron.schedule('*/4 * * * *', main_logic);
};
