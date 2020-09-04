const { sequelize } = require('./db');
const errorCodes = require('../../utilities/errorCodes');
const { deepClone } = require('../../utilities/utilities');

ERROR = console.error;

requestHandler = (apiParameters) => {
    const { isTransaction, utility } = apiParameters;
    return async(request,response) => {
        var transaction = null;
        if(isTransaction)
        {
            transaction = await sequelize.transaction();
        }
        try
        {
            
            const result = deepClone(await utility(request.body,transaction));
            if(isTransaction)
            {
                transaction.commit();
            }
            response.json({status:'ok', result});
        }
        catch(exception)
        {
            const exceptionString = exception.toString();

            response.json({ 
                status:'error', 
                error_code:errorCodes.INTERNAL_SERVER_ERROR,
                error_message : exceptionString 
            });

            ERROR({ ErrorString : exceptionString,request : request.body});
            
            if(isTransaction && transaction)
            {
                try
                {
                    transaction.rollback();
                }
                catch(transactionRollBackException)
                {
                    ERROR({ ErrorString :transactionRollBackException.toString() });
                }
            } 
        }
    };
};

module.exports = requestHandler;