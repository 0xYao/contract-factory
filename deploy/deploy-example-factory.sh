deploy() {
	NETWORK=$1

  echo "Deploying the example factory to $NETWORK"
	RAW_RETURN_DATA=$(forge script script/DeployWithCREATE3.s.sol -f $NETWORK -vvvv --json --silent --broadcast --verify --skip-simulation)
  echo $RAW_RETURN_DATA
	RETURN_DATA=$(echo $RAW_RETURN_DATA | jq -r '.returns' 2> /dev/null)

	factory=$(echo $RETURN_DATA | jq -r '.deployed.value')
  echo "Successfully deployed the contract to $factory"

	saveContract $NETWORK ExampleContractFactory $factory
}

saveContract() {
	NETWORK=$1
	CONTRACT=$2
	ADDRESS=$3

	ADDRESSES_FILE=./deployments/$NETWORK.json

	# create an empty json if it does not exist
	if [[ ! -e $ADDRESSES_FILE ]]; then
		echo "{}" >"$ADDRESSES_FILE"
	fi

  echo "Saving the contract address to $ADDRESSES_FILE"
	result=$(cat "$ADDRESSES_FILE" | jq -r ". + {\"$CONTRACT\": \"$ADDRESS\"}")
	printf %s "$result" >"$ADDRESSES_FILE"
}

deploy $1
