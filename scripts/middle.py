import sys
import random
import time

random.seed(sys.argv[1] + sys.argv[2])
time.sleep(2)
print(random.random())
#print(sys.argv)