export DEBUGBUILD = no
ifeq ($(DEBUGBUILD), yes)
    DEBUGFLAGS = -g -DDEBUG
else
    DEBUGFLAGS = -O2 -DNDEBUG
endif

export CC       = g++
export CFLAGS   = -W -Wall -ansi $(DEBUGFLAGS)
export LDFLAGS  = 
export EXECPATH = ../bin

EXECPATH = ../bin

# $@ - the name of the target
# $^ - all dependencies
# $< - the first dependency

dorkanoid: Dorkanoid.o Entity.o Brick.o
	$(CC) $(LDFLAGS) -o $(EXECPATH)/$@ $^ -lsfml-audio -lsfml-graphics -lsfml-window -lsfml-system

Dorkanoid.o: Dorkanoid.cpp
	$(CC) -o $@ -c $< $(CFLAGS)

Brick.o: Brick.cpp Brick.h Entity.h
	$(CC) -o $@ -c $< $(CFLAGS)

Entity.o: Entity.cpp Entity.h
	$(CC) -o $@ -c $< $(CFLAGS)

clean:
	rm -rf *.o
