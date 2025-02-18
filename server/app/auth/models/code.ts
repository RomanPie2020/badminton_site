import { DataTypes, Model } from 'sequelize'
import sequelize from '../config/database'

class Code extends Model {}

Code.init(
	{
		code: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		expirationTime: {
			type: DataTypes.DATE,
			allowNull: false,
		},
	},
	{
		sequelize,
		modelName: 'Code',
		tableName: 'codes',
	}
)

export default Code
