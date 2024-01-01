const Order = require("../../models/order");


module.exports.fetchDataGraph = async (req, res) => {
    try {
        const time = req.params.time;
        if (time === 'month') {
            const currentYear = new Date().getFullYear();
            const data = await Order.aggregate([
                {
                    $match: {
                        createdAt: {
                            $gte: new Date(`${currentYear}-01-01T00:00:00.000Z`),
                            $lt: new Date(`${currentYear + 1}-01-01T00:00:00.000Z`)
                        }
                    }
                },
                {
                    $group: {
                        _id: { $month: '$createdAt' }, 
                        ordersCount: { $sum: 1 } 
                    }
                }
            ]);

            const allMonths = {
                'January': 0,
                'February': 0,
                'March': 0,
                'April': 0,
                'May': 0,
                'June': 0,
                'July': 0,
                'August': 0,
                'September': 0,
                'October': 0,
                'November': 0,
                'December': 0
            };
            data.forEach(item => {
                const month = new Date(`2023-${item._id}-01`).toLocaleString('default', { month: 'long' });
                allMonths[month] = item.ordersCount;
            });
            console.log(allMonths);

            res.json(allMonths);
        }

        if (time === 'year') {
            
            const startYear = 2020;
            const endYear = 2025;
        
           
            const ordersByYear = {};
        
           
            for (let year = startYear; year <= endYear; year++) {
                const data = await Order.aggregate([
                    {
                        $match: {
                            createdAt: {
                                $gte: new Date(`${year}-01-01T00:00:00.000Z`),
                                $lt: new Date(`${year + 1}-01-01T00:00:00.000Z`)
                            }
                        }
                    },
                    {
                        $group: {
                            _id: null,
                            ordersCount: { $sum: 1 }
                        }
                    }
                ]);
        
                
                const orderCount = data.length > 0 ? data[0].ordersCount : 0;
        
                ordersByYear[year] = orderCount;
            }
        
            console.log(ordersByYear);
        
            res.json(ordersByYear);
        }



        if (time === 'week') {
            const currentDate = new Date();
            const currentYear = currentDate.getFullYear();
            const currentMonth = currentDate.getMonth();
            const currentDay = currentDate.getDate();
            
            
            
            const dayOfWeek = currentDate.getDay();
            
            
            const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            
            
            const startDate = new Date(currentYear, currentMonth, currentDay - dayOfWeek);
            
            
            const ordersByDayOfWeek = {};

            for (let day = 0; day < 7; day++) {
                const date = new Date(startDate);
                date.setDate(startDate.getDate() + day);
                console.log(date);
                
                const data = await Order.aggregate([
                    {
                        $match: {
                            createdAt: {
                                $gte: new Date(date.setHours(0, 0, 0, 0)),
                                $lt: new Date(date.setHours(23, 59, 59, 999))
                            }
                        }
                    },
                    {
                        $group: {
                            _id: null,
                            ordersCount: { $sum: 1 }
                        }
                    }
                ]);
                
                const orderCount = data.length > 0 ? data[0].ordersCount : 0;

                ordersByDayOfWeek[dayNames[day]] = orderCount;
            }
            
            console.log(ordersByDayOfWeek);
            
            res.json(ordersByDayOfWeek);
        }
        
        
        
    } catch (error) {
        console.log(error);
        const statusCode = 500;
        const errorMessage = "An error occured while fetching the data";
        res.status(statusCode).render('errorPage', { statusCode, errorMessage });
    }
};

