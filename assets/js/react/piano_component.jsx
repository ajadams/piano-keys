// React - piano_component.jsx


// ----- top level app component
var App_Component = React.createClass({
	getInitialState: function(){
		return {
			keyLog: [],
		};
	},

	//is triggered when key gets pressed/clicked
	keyPressed: function(key, shouldLog){
		if( shouldLog ){
			this.addToLog(key);
		}
	},

	//adds key name to log
	addToLog: function(key){
		this.state.keyLog.push(key);
		this.setState({keyLog: this.state.keyLog});
	},

	//clears log
	clearLog: function(){
		this.state.keyLog.length = 0;
		this.setState({keyLog: this.state.keyLog});
	},

	//pass and array of valid keys name and will loop through each index applying key-highlighting class
	autoplay: function(string_of_keys, should_log){
		var active_elem, loop, i = 0, _this = this;

		loop = setInterval(function(){
			//if there are any active keys, remove active class
			active_elem = $('.key.active');
			if( active_elem.length > 0 ){
				active_elem.removeClass('active');
			}

			//make key active if there are still keys to play, otherwise clear interval/loop
			if( i < string_of_keys.length ){
				elem = $('.'+string_of_keys[i]+'-key');
				elem.addClass('active');
				_this.keyPressed( string_of_keys[i].toUpperCase(), should_log );
				i++;
			}else{
				clearInterval(loop);
				_this.donePlaying();
				if( active_elem.length > 0 ){
					active_elem.removeClass('active');
				}
			}
		}, 1000);
	},

	//grab input and message and restore to default
	donePlaying: function(){
		$('.key-input').prop('disabled', false);
		$('.now-playing').hide();
	},

	render: function(){
		return (
			<div className="app-container">

				<h1 className="text-center">Piano<small>Keys</small></h1>

				<Piano keyPressed={this.keyPressed} />

				<div className="container-fluid">
					<div className="row">
						<div className="col-xs-10 col-xs-offset-1 col-sm-4 col-sm-offset-2 col-md-4 col-lg-3 col-lg-offset-3">
							<Autoplay autoplay={this.autoplay} />
						</div>

						<div className="col-xs-10 col-xs-offset-1 col-sm-4 col-sm-offset-0 col-md-4 col-lg-3">
							<KeyLog keys={this.state.keyLog} clearLog={this.clearLog} autoplay={this.autoplay} />
						</div>

						<div className="clearfix"></div>
					</div>
				</div>

				<div className="text-center copyright"><small>{ String.fromCharCode(169) + ' 2016 Adam Adams' }</small></div>

			</div>
		);
	}
});
// ----- top level app component



// ----- Piano and piano key components
var Piano = React.createClass({
	render: function(){
		return (
			<div className="piano">
				<White_Key css={'key c-key text-center'} text={'C'} keyPressed={this.props.keyPressed} />
				<White_Key css={'key d-key text-center'} text={'D'} keyPressed={this.props.keyPressed} />
				<White_Key css={'key e-key text-center'} text={'E'} keyPressed={this.props.keyPressed} />
				<White_Key css={'key f-key text-center'} text={'F'} keyPressed={this.props.keyPressed} />
				<White_Key css={'key g-key text-center'} text={'G'} keyPressed={this.props.keyPressed} />
				<White_Key css={'key a-key text-center'} text={'A'} keyPressed={this.props.keyPressed} />
				<White_Key css={'key b-key text-center'} text={'B'} keyPressed={this.props.keyPressed} />
				<Black_Key css={'black-keys cd-key'} />
				<Black_Key css={'black-keys de-key'} />
				<Black_Key css={'black-keys fg-key'} />
				<Black_Key css={'black-keys ga-key'} />
				<Black_Key css={'black-keys ab-key'} />
			</div>
		);
	}
});

var White_Key = React.createClass({
	clicked: function(e){
		var elem = $(e.target);

		//make target key active and trigger keyPressed to add to log
		elem.addClass('active');
		this.props.keyPressed( new Array(elem.text()), true );

		//delay for half a second before removing active class
		elem.delay(500).queue(function(){
			$(this).removeClass('active').dequeue();
		});
	},

	render: function(){
		return (
			<div className={this.props.css} onClick={this.clicked}>
				{this.props.text}
			</div>
		);
	}
});

var Black_Key = React.createClass({
	render: function(){
		return <div className={this.props.css}></div>;
	}
});
// ----- Piano and piano key components



// ----- Log and log item components
var KeyLog = React.createClass({
	render: function(){
		var _this = this;
		return (
			<div className="log">
				<h4>Key Log ({this.props.keys.length}) <small onClick={this.props.clearLog}>clear</small></h4>
				{
					this.props.keys.length > 0 ?
					this.props.keys.map(function(val, index, arr){
						return <LogItem key={index} text={val} css={val+'-color item'} autoplay={_this.props.autoplay} />;
					}) :
					<div><small>Nothing to log</small></div>
				}
			</div>
		);
	}
});

var LogItem = React.createClass({
	//make key active by using autoplay, but no need to add to log
	clicked: function(e){
		var key = $(e.target).text();
		this.props.autoplay( new Array(key), false );
	},

	render: function(){
		return (
			<div className={this.props.css} onClick={this.clicked}>
				{this.props.text}
			</div>
		);
	}
});
// ----- Log and log item components



// ----- Autoplay component
var Autoplay = React.createClass({
	play: function(e){
		var val, is_valid;

		e.preventDefault();

		//if key-input is disabled and now-playing message is visible, then don't do anything on click
		if( !$('.now-playing').is(':visible') ){
			val = $('.key-input').val();
			is_valid = this.validate( val );

			//if inputs are valid, then proceed with autoplaying keys
			if( is_valid ){
				$('.key-input').val('').prop('disabled', true);
				$('.now-playing').show();
				val = val.split(',');
				this.props.autoplay( val, true );
			}
		}		
	},

	//validate input - returns true or false
	validate: function(val){
		var valid_chars = ['a', 'b', 'c', 'd', 'e', 'f', 'g'], 
			match = false, valid = true, submitted;

		submitted = val.split(',');

		//loop through each index of the submitted string that has been converted to an array
		for( var i = 0; i < submitted.length; i++ ){

			//check length of each index
			if( submitted[i].length > 1 || submitted[i].length === 0 ){
				$('.input-group').addClass('has-error').closest('form').find('.error-msg').show();
				valid = false;
				break;
			}else{
				//reset match to false for the next letter to be checked
				match = false;
				for( var k = 0; k < valid_chars.length; k++ ){
					if( valid_chars[k] === submitted[i] ){
						match = true;
						break;
					}
				}

				//if current letter doesn't match valid chars then break and show error
				if( !match ){
					$('.input-group').addClass('has-error').closest('form').find('.error-msg').show();
					valid = false;
					break;
				}
			}
		}

		//removing error styling when valid, if any were applied before
		if( valid ){
			$('.input-group').removeClass('has-error').closest('form').find('.error-msg').hide();
		}

		return valid;
	},

	render: function(){
		var directions = 'Enter a string of valid piano keys, delimited by a comma, and we will play those keys for you.';
		return (
			<div className="autoplay">
				<h4>Autoplay</h4>
				<form onSubmit={this.play} className="form-inline">
				<label>Directions: <small>{directions}</small></label>
					<div className="input-group">
						<input type="text" className="key-input form-control" placeholder="Enter keys to play" />
						<div className="play-btn input-group-addon" onClick={this.play}>Play</div>
					</div>
					<div className="error-msg"><small>Invalid input. Ex: a,b,c,d</small></div>
					<div className="now-playing"><small>Now playing...</small></div>
				</form>
			</div>
		);
	}
});
// ----- Autoplay component


// Render components to DOM
ReactDOM.render( <App_Component />, document.getElementById('main-container') );