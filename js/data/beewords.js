/* Grade 1 spelling bee practice words. This is our own list of common grade 1 words, grouped by spelling pattern, NOT the official
   Scripps list (which is copyrighted). Parents can paste the organisers' list in the Grown-ups area.
   Each line: word | short child-friendly meaning | sentence that uses the word. US spelling. Tier 1 = easiest, 3 = stretch. */
(function () {
  const G = (id, name, tier, emoji, tip, lines) => ({ id, name, tier, emoji, tip, words: lines.trim().split('\n').map(l => l.split('|').map(s => s.trim())) });
  window.BEE_GROUPS = [
    G('short-a', 'Short a words', 1, '🐱', 'The a says its short sound, like in cat.', `
cat|a small furry pet that purrs|The cat sat on my lap.
hat|something you wear on your head|I wore a hat in the sun.
mat|a small rug for the floor|Wipe your feet on the mat.
bat|a stick used to hit a ball|He hit the ball with a bat.
sad|not happy|I felt sad when my toy broke.
fan|something that blows cool air|The fan keeps me cool.
man|a grown-up male person|The man waved hello.
van|a big car that carries things|Dad drove the van to the store.
cap|a soft hat with a brim|He put on his red cap.
map|a picture that shows where places are|We used a map to find the park.
bag|something you carry things in|I put my books in my bag.
jam|a sweet fruit spread|I like jam on my toast.`),
    G('short-e', 'Short e words', 1, '🥚', 'The e says its short sound, like in bed.', `
bed|the place where you sleep|I sleep in my bed.
red|the color of a strawberry|The apple is red.
pen|something you write with|Please write with a pen.
ten|the number 10|I have ten fingers.
hen|a mother chicken|The hen sat on her eggs.
net|something with holes that catches fish|He caught a fish in the net.
wet|not dry|My socks got wet in the rain.
get|to go and bring something back|Please get your coat.
leg|the part of the body you walk on|I hurt my leg.
egg|an oval thing that a hen lays|I ate an egg for breakfast.
yes|a word that means okay|Yes, I would like some milk.
jet|a very fast airplane|The jet flew high in the sky.`),
    G('short-i', 'Short i words', 1, '🐷', 'The i says its short sound, like in pig.', `
sit|to rest on a chair|Please sit on the chair.
pin|a small sharp stick used to hold cloth|Mom used a pin to fix my shirt.
pig|a farm animal that oinks|The pig rolled in the mud.
big|large|The elephant is big.
dig|to make a hole in the ground|I like to dig in the sand.
lip|the soft edge of your mouth|I bit my lip.
zip|to close a coat with a zipper|Please zip your coat.
kid|a child|The kid rode a bike.
hit|to strike something|Please do not hit the ball too hard.
fix|to mend something that is broken|Dad can fix my bike.
six|the number 6|I am six years old.
win|to come in first|I hope our team will win.`),
    G('short-o', 'Short o words', 1, '🐶', 'The o says its short sound, like in dog.', `
dog|a pet that barks|My dog likes to play fetch.
top|the highest part of something|Put the star on the top.
hop|to jump on one foot|I can hop up the steps.
pot|a deep pan for cooking|Mom made soup in a pot.
box|a square container|The toys are in the box.
fox|a wild animal with a bushy tail|The fox ran into the woods.
hot|very warm|The soup is hot.
mop|something used to clean the floor|Dad used a mop on the floor.
log|a thick piece of wood from a tree|We sat on a log.
job|work that a person does|My job is to feed the fish.
sock|a soft cover for your foot|I lost one sock.
rock|a hard piece of stone|I found a smooth rock.`),
    G('short-u', 'Short u words', 1, '☀️', 'The u says its short sound, like in sun.', `
sun|the bright star in our sky|The sun is warm today.
run|to move fast on your feet|I can run very fast.
fun|something that makes you happy|The park is fun.
cup|something you drink from|I drank milk from a cup.
bus|a big vehicle that carries many people|I ride the bus to school.
bug|a tiny insect|A bug crawled on the leaf.
mud|wet, soft dirt|The pig played in the mud.
hug|to hold someone close|I gave Grandma a hug.
rug|a soft cover for the floor|The cat sleeps on the rug.
nut|a hard seed with a shell|The squirrel found a nut.
gum|something sweet that you chew|Do not swallow gum.
tub|a big bowl for washing|I take a bath in the tub.`),
    G('sight-1', 'Tricky words, set 1', 1, '✨', 'These words do not follow the usual sound rules. Learn them by heart.', `
the|a small word that points to a thing|The sun is hot.
and|a word that joins things together|I like cats and dogs.
you|the person I am talking to|I can see you.
was|a word that tells about the past|It was a sunny day.
said|spoke words out loud|She said hello.
have|to own or hold|I have a red kite.
are|a word used with we, you and they|We are friends.
they|more than one person or thing|They went to the park.
what|a word used to ask a question|What is your name?
with|together, along side|Come play with me.
one|the number 1|I ate one apple.
come|to move toward this place|Please come here.`),
    G('sight-2', 'Tricky words, set 2', 1, '✨', 'More words you cannot sound out. Look, say, cover, write, check.', `
from|starting at a place|The gift is from Grandma.
some|a few or a part|I would like some water.
were|a word that tells about the past for more than one|We were at the park.
your|belonging to you|Is this your hat?
want|to wish to have|I want a snack.
there|in that place|The ball is over there.
where|in what place|Where is my shoe?
who|a word used to ask which person|Who is at the door?
does|a word used with he, she and it|She does her homework.
put|to place something|Please put the book on the shelf.
into|going in|The frog jumped into the pond.
went|moved to a place|We went to the zoo.`),
    G('colors-numbers', 'Colors and numbers', 1, '🌈', 'Words you see every day.', `
blue|the color of the sky|The sky is blue.
green|the color of grass|The frog is green.
black|the color of night|The cat is black.
white|the color of snow|The snow is white.
pink|a light red color|She wore a pink dress.
brown|the color of a chocolate bar|The bear is brown.
two|the number 2|I have two hands.
three|the number 3|A triangle has three sides.
four|the number 4|A dog has four legs.
seven|the number 7|There are seven days in a week.
eight|the number 8|A spider has eight legs.
twelve|the number 12|A dozen is twelve.`),
    G('family', 'People and helping words', 2, '👨‍👩‍👧', 'Words about the people around you.', `
mother|a female parent|My mother reads me a story.
father|a male parent|My father cooks dinner.
sister|a girl who has the same parents as you|My sister plays with me.
brother|a boy who has the same parents as you|My brother is taller than me.
baby|a very young child|The baby is asleep.
family|a group of people who live together|My family eats dinner together.
teacher|a person who helps you learn|My teacher reads to the class.
girl|a young female child|The girl jumped rope.
boy|a young male child|The boy kicked the ball.
kind|nice and caring|Be kind to others.
help|to make something easier for someone|Can you help me?
story|a tale that is told or written|I like a bedtime story.`),
    G('start-blends', 'Blends at the start', 2, '🐸', 'Two consonants at the start, and you hear both: fr-og.', `
frog|a green animal that hops and croaks|The frog sat on a lily pad.
stop|to not move any more|Stop at the red light.
drum|an instrument you bang|He played the drum.
flag|a cloth with a design that stands for a country|The flag waved in the wind.
swim|to move through water|I can swim in the pool.
crab|a sea animal with claws|The crab walked sideways.
snap|to make a quick clicking sound|I can snap my fingers.
clap|to hit your hands together|We clap after a song.
plum|a soft purple fruit|I ate a juicy plum.
skip|to hop from one foot to the other|We skip down the path.
step|one movement of your foot|Take a step forward.
grab|to take hold of something quickly|Grab your coat.`),
    G('end-blends', 'Blends at the end', 2, '⛺', 'Two consonants at the end, and you hear both: han-d.', `
hand|the part of your body at the end of your arm|Raise your hand.
milk|a white drink that comes from cows|I drink milk with lunch.
nest|a home that a bird builds|The bird made a nest.
lamp|a light you can turn on|Turn on the lamp.
jump|to push yourself into the air|I can jump very high.
desk|a table where you work|I sit at my desk.
gift|a present|I gave her a gift.
tent|a shelter made of cloth|We slept in a tent.
bank|a place that keeps money|Dad went to the bank.
camp|to sleep outside|We like to camp.
belt|a strip that goes around your waist|He wears a belt.
sand|tiny bits of rock on a beach|I built a castle in the sand.`),
    G('sh-ch', 'Digraphs sh and ch', 2, '🐑', 'Two letters make one new sound: sh and ch.', `
ship|a big boat|The ship sailed across the sea.
shop|a place where you buy things|We went to the shop.
fish|an animal that swims in water|The fish swam in the tank.
dish|a plate or bowl|Please wash the dish.
shell|the hard cover of a snail or an egg|I found a shell on the beach.
wish|to hope for something|Make a wish.
brush|something you use to clean your teeth|I use a brush every day.
sheep|a farm animal with wool|The sheep ate the grass.
chip|a small piece that breaks off|There is a chip in my cup.
chin|the part of your face below your mouth|I rested my chin on my hand.
lunch|the meal you eat in the middle of the day|We eat lunch at noon.
chick|a baby bird|The chick hatched from its egg.`),
    G('th-wh', 'Digraphs th and wh', 2, '🐋', 'Two letters make one new sound: th and wh.', `
thin|not thick|The paper is thin.
thick|wide from one side to the other|The book is very thick.
this|the one that is near me|I like this song.
then|after that|First we eat, then we play.
bath|washing yourself in a tub|I take a bath at night.
path|a narrow way to walk on|We walked along the path.
thumb|the short, fat finger on your hand|I hurt my thumb.
moth|an insect that flies at night|A moth flew around the light.
whale|a huge animal that lives in the sea|The whale swam by the boat.
wheel|a round thing that turns|The bike has two wheels.
when|at what time|When is your birthday?
which|a word used to ask about a choice|Which one do you want?`),
    G('magic-a', 'Magic e with a', 2, '🎂', 'The silent e makes the a say its name: cake.', `
cake|a sweet treat for parties|We ate cake on my birthday.
make|to build or create something|I can make a card.
game|something you play|Let us play a game.
name|what you are called|My name is Sam.
late|after the right time|Do not be late for school.
gate|a door in a fence|Please close the gate.
lake|a big pool of water with land all around|We swam in the lake.
safe|not in danger|Buckle up to stay safe.
cave|a big hole in a hill or mountain|A bear lives in the cave.
wave|to move your hand to say hello|I wave to my friend.
take|to pick something up and carry it|Take your umbrella.
race|a contest to see who is fastest|I won the race.`),
    G('magic-ioU', 'Magic e with i, o and u', 2, '🪁', 'The silent e makes the vowel say its name: kite, bone, cube.', `
kite|a toy that flies on a string|The kite flew high.
bike|a two-wheeled ride you pedal|I ride my bike to the park.
five|the number 5|A hand has five fingers.
nine|the number 9|I have nine crayons.
like|to enjoy something|I like pizza.
time|what a clock tells you|What time is it?
bone|a hard part inside your body|The dog chewed a bone.
home|the place where you live|I am going home.
nose|the part of your face you smell with|I smell flowers with my nose.
rope|a thick, strong string|We used a rope to climb.
cube|a shape with six square sides|A dice is a cube.
huge|very, very big|The whale is huge.`),
    G('ai-ay', 'Vowel teams ai and ay', 2, '🌧️', 'ai and ay both say a: rain, day.', `
rain|water that falls from clouds|The rain fell all day.
tail|the part at the back of an animal|The dog wagged its tail.
train|a long vehicle that runs on tracks|We rode the train.
mail|letters and packages that are delivered|The mail came today.
paint|colored liquid for making pictures|I like to paint pictures.
wait|to stay until something happens|Please wait here.
day|the time when it is light|It was a sunny day.
play|to have fun|We play at recess.
say|to speak words|Say hello to Grandpa.
way|a path or a direction|Which way is the park?
stay|to remain in one place|Please stay in your seat.
today|this day|Today is Friday.`),
    G('ee-ea', 'Vowel teams ee and ea', 2, '🌳', 'ee and ea both say ee: tree, leaf.', `
tree|a tall plant with a trunk and branches|A bird sat in the tree.
feet|more than one foot|My feet are cold.
seed|a tiny thing that grows into a plant|I planted a seed.
sleep|to rest with your eyes closed|I sleep at night.
seat|a place to sit|Please take your seat.
leaf|a flat green part of a plant|A leaf fell from the tree.
eat|to chew and swallow food|We eat dinner at six.
beach|sandy land by the sea|We built a sandcastle at the beach.
team|a group that plays together|Our team scored a goal.
dream|pictures you see in your mind when you sleep|I had a dream about a dragon.
meat|the food that comes from animals|We had meat and rice.
week|seven days|There are seven days in a week.`),
    G('oa-ow', 'Vowel teams oa and ow', 2, '⛵', 'oa and ow can say oh: boat, snow.', `
boat|something that floats and carries people on water|We rode in a boat.
coat|something warm you wear outside|Put on your coat.
road|a wide path for cars|The car drove down the road.
goat|a farm animal with horns|The goat ate some grass.
soap|something you use to wash with|Wash your hands with soap.
toast|bread that is browned by heat|I had toast for breakfast.
snow|soft, white, frozen rain|We built a snowman in the snow.
grow|to get bigger|Plants grow in the sun.
yellow|the color of a banana|The sun is yellow.
show|to let someone see|Let me show you my picture.
blow|to push air out of your mouth|Blow out the candles.
slow|not fast|The turtle is slow.`),
    G('oo', 'The oo words', 2, '🌙', 'oo can say the long sound in moon or the short sound in book.', `
moon|the light in the night sky|The moon is bright tonight.
food|things you eat|We packed food for the trip.
zoo|a park where animals live|We saw a lion at the zoo.
spoon|something you eat soup with|Eat your soup with a spoon.
room|a space inside a house|Clean up your room.
book|pages that you read|I read a book every night.
look|to use your eyes|Look at the rainbow.
good|nice or well done|You did a good job.
foot|the part of your body at the end of your leg|I hurt my foot.
cook|to make food hot and ready to eat|Dad will cook dinner.
wood|the hard stuff that trees are made of|The table is made of wood.
roof|the top of a house|The cat sat on the roof.`),
    G('r-controlled', 'Bossy r words', 2, '⭐', 'The r changes the vowel sound: car, bird, corn.', `
car|a vehicle with four wheels|We rode in the car.
star|a bright light in the night sky|I wished on a star.
farm|land where crops and animals are raised|The cow lives on a farm.
park|a place outside with grass and swings|We play at the park.
corn|a yellow vegetable that grows on a cob|We ate corn for dinner.
horse|a big animal you can ride|She rode a horse.
storm|very bad weather with wind and rain|The storm knocked down a branch.
fork|something you eat with that has points|Use a fork to eat your pasta.
bird|an animal with feathers and wings|The bird sang a song.
shirt|clothing you wear on the top half of your body|He wore a blue shirt.
first|before all others|I was first in line.
turn|to go around or change direction|Turn left at the corner.`),
    G('ou-oi', 'Vowel teams ou, ow, oi and oy', 2, '☁️', 'ou and ow can say ow, and oi and oy say oy.', `
out|not inside|The dog went out.
house|a building where people live|We live in a big house.
mouse|a tiny furry animal with a long tail|The mouse ate some cheese.
cloud|a fluffy white thing in the sky|A cloud covered the sun.
loud|very noisy|The drum is loud.
cow|a farm animal that gives milk|The cow says moo.
town|a place smaller than a city|We live in a small town.
clown|a funny person in a circus|The clown made us laugh.
coin|a small round piece of money|I found a coin.
oil|a slippery liquid|Mom cooks with oil.
toy|something you play with|My toy is a robot.
joy|great happiness|The puppy brought us joy.`),
    G('tricky-words', 'Trickiest words', 3, '🧩', 'Some words break the rules. Circle the tricky part and learn it by heart.', `
friend|a person you like and play with|My friend came over to play.
because|a word that gives a reason|I am happy because it is Friday.
people|men, women and children|Many people were at the park.
would|a word that means will in the past|I would like some juice.
could|a word that means was able to|I could see the moon.
should|a word that tells what is right to do|You should wash your hands.
again|one more time|Please read it again.
always|every time|I always brush my teeth.
every|each one|I go to school every day.
many|a large number of|We saw many stars.
once|one time|I rode a horse once.
other|not the same one|Where is the other shoe?`),
    G('animals', 'Animals', 3, '🦒', 'Say the word slowly and count the beats.', `
elephant|a huge gray animal with a trunk|The elephant sprayed water.
giraffe|a very tall animal with a long neck|The giraffe ate leaves from the tree.
monkey|an animal that climbs and swings in trees|The monkey ate a banana.
rabbit|a small animal with long ears|The rabbit hopped away.
turtle|an animal with a shell that walks slowly|The turtle hid in its shell.
spider|a small animal with eight legs that spins webs|A spider spun a web.
dolphin|a smart sea animal that jumps and clicks|The dolphin jumped out of the water.
penguin|a black and white bird that swims but cannot fly|The penguin slid on the ice.
chicken|a farm bird that lays eggs|The chicken pecked at the corn.
kitten|a baby cat|The kitten drank some milk.
tiger|a big cat with stripes|The tiger has orange stripes.
zebra|a horse-like animal with black and white stripes|The zebra ran across the plain.`),
    G('food', 'Food', 3, '🍕', 'Tasty words to spell.', `
banana|a long yellow fruit|I peeled a banana.
orange|a round fruit with a thick peel|I drank orange juice.
apple|a crunchy red or green fruit|An apple a day is good for you.
cookie|a small sweet baked treat|I ate a chocolate cookie.
pizza|a baked dish with cheese and sauce|We had pizza for dinner.
sandwich|two pieces of bread with food in between|I ate a cheese sandwich.
cheese|a food made from milk|The mouse loves cheese.
lemon|a sour yellow fruit|The lemon tastes sour.
carrot|an orange vegetable that grows underground|The rabbit ate a carrot.
cherry|a small round red fruit|A cherry was on top of the cake.
pancake|a flat cake cooked in a pan|I ate a pancake with syrup.
popcorn|corn that pops when it is heated|We ate popcorn at the movies.`),
    G('home-school', 'Home and school', 3, '🏫', 'Words you use every day at home and at school.', `
school|a place where children learn|I walk to school.
pencil|something you write with that has lead|Sharpen your pencil.
paper|thin sheets you write or draw on|I drew on the paper.
table|a piece of furniture with a flat top|We eat at the table.
window|a glass opening in a wall|I looked out the window.
kitchen|the room where food is cooked|Mom is in the kitchen.
garden|a place where flowers or vegetables grow|We planted seeds in the garden.
bedroom|the room where you sleep|My bedroom has a blue rug.
library|a place with lots of books to borrow|We got books at the library.
classroom|the room where a class meets|Our classroom has a fish tank.
homework|schoolwork you do at home|I finished my homework.
backpack|a bag you wear on your back|I carry my books in my backpack.`),
    G('compound', 'Two words joined', 3, '🌻', 'Two small words join to make a new word: sun + flower.', `
sunflower|a tall yellow flower that follows the sun|A sunflower grew by the fence.
rainbow|colors in the sky after rain|We saw a rainbow after the storm.
football|a game played with an oval ball|We played football at recess.
cupcake|a small cake baked in a paper cup|She frosted the cupcake.
playground|a place with swings and slides|We went to the playground.
butterfly|an insect with colorful wings|A butterfly landed on the flower.
bathtub|a big tub for taking a bath|The duck floated in the bathtub.
birthday|the day you were born, every year|My birthday is in June.
sunshine|the light from the sun|We played in the sunshine.
snowman|a figure made from rolled snow|We made a snowman.
airplane|a machine that flies through the sky|The airplane flew over the city.
lunchbox|a box that holds your lunch|I packed a sandwich in my lunchbox.`),
    G('nature', 'Nature and weather', 3, '🌋', 'Words about the world outside.', `
thunder|the loud noise after lightning|The thunder made me jump.
forest|a large area full of trees|Deer live in the forest.
ocean|a huge body of salt water|Whales swim in the ocean.
river|a long stream of water that flows|The river runs to the sea.
island|land with water all around it|We sailed to an island.
mountain|a very high hill|We climbed the mountain.
winter|the cold season|It snows in winter.
summer|the hot season|We swim in summer.
flower|the colorful part of a plant|She picked a flower.
windy|having a lot of wind|It is a windy day.
sunny|bright with sunshine|It is sunny today.
rainy|wet with rain|It was a rainy day.`),
    G('feelings-actions', 'Feelings and actions', 3, '😊', 'Words for how we feel and what we do.', `
happy|feeling good and glad|I am happy today.
angry|feeling very mad|He was angry when he lost.
sleepy|ready for bed|I am sleepy after the long day.
hungry|wanting to eat|I am hungry for lunch.
laugh|to make a happy sound|The joke made us laugh.
smile|to turn up the corners of your mouth|Please smile for the picture.
dance|to move your body to music|We like to dance.
listen|to pay attention to sounds|Listen to the birds.
whisper|to speak very softly|Please whisper in the library.
please|a polite word when you ask for something|May I have a cookie, please?
thanks|a word you say to show you are grateful|Thanks for the help.
giggle|to laugh in a silly, high way|The baby began to giggle.`),
    G('endings', 'Words with endings', 3, '🏃', 'Add -ing, -ed, -es or -s to change a word.', `
jumping|moving up into the air|The frog is jumping.
playing|having fun|The kids are playing tag.
looked|used your eyes|She looked at the map.
wanted|wished for|He wanted a snack.
running|moving fast on your feet|The dog is running.
boxes|more than one box|The boxes are full of toys.
dishes|more than one dish|Please wash the dishes.
babies|more than one baby|The babies are asleep.
eating|chewing and swallowing food|We are eating lunch.
walked|moved on your feet|We walked to the store.
helped|made something easier|She helped me with my shoes.
wishes|hopes for things|Her wishes came true.`),
    G('challenge', 'Big challenge words', 3, '🏆', 'Stretch words for the big day. Say them in chunks.', `
beautiful|very pretty|The garden is beautiful.
together|with each other|We played together.
favorite|the one you like best|Blue is my favorite color.
morning|the early part of the day|I brush my teeth every morning.
umbrella|something that keeps you dry in the rain|Take an umbrella today.
treasure|gold, jewels and other riches|The pirates buried the treasure.
remember|to keep something in your mind|Please remember your lunchbox.
dinosaur|a giant animal that lived long ago|The dinosaur had sharp teeth.
surprise|something you did not expect|The party was a surprise.
adventure|an exciting trip or event|We went on an adventure.
vacation|a trip you take for fun|We went to the beach on vacation.
delicious|tasting very good|The cake was delicious.`)
  ];
})();
